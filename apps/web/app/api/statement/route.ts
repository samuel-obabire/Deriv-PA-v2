import { getOneOrganizationCurrency } from "@repo/db/queries";
import {
	type DerivRestConfig,
	DerivRestError,
	paymentAgentWalletTransactions,
} from "@repo/deriv";
import { ForbiddenError, RequestError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { decryptToken, tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { getSearchParamsFromRequest } from "@/lib/utils/getSearchParamsFromRequest";
import { StatementQuerySchema } from "@/lib/validations/deriv/statement";
import { serverEnv } from "@/lib/validations/env/server";

const derivRestConfig: DerivRestConfig = {
	baseUrl: serverEnv.DERIV_REST_BASE_URL,
	appId: serverEnv.DERIV_APP_ID,
	timeoutMs: serverEnv.DERIV_REST_TIMEOUT_MS,
};

// Deriv's pagination links are full URLs carrying page_cursor as a query
// param, not the bare cursor value itself.
const extractPageCursor = (link: string | null): string | null => {
	if (!link) return null;

	return new URL(link, "https://placeholder.internal").searchParams.get(
		"page_cursor",
	);
};

export const GET = async (req: NextRequest) => {
	const searchParams = getSearchParamsFromRequest(req);

	const [actionResult, actionError] = await tryCatch(() =>
		action({
			params: searchParams,
			schema: StatementQuerySchema,
		}),
	);

	if (actionError) return handleError(actionError, "api");

	const [permitted, permissionError] = await tryCatch(() =>
		hasPermission({ statement: ["view"] }),
	);

	if (permissionError) return handleError(permissionError, "api");
	if (!permitted.success) {
		return handleError(new ForbiddenError("Statement"), "api");
	}

	const organizationId = actionResult.session?.session
		.activeOrganizationId as string;

	const { currency, action_type, date_from, date_to, limit, cursor } =
		actionResult.params;

	const [orgCurrency, currencyError] = await tryCatch(() =>
		getOneOrganizationCurrency(
			{
				organizationId,
				currencyCode: currency,
				options: { includeToken: true },
			},
			db,
		),
	);

	if (currencyError) return handleError(currencyError, "api");

	const [response, requestError] = await tryCatch(() =>
		paymentAgentWalletTransactions(
			derivRestConfig,
			decryptToken(orgCurrency.token),
			{
				start_date_time: date_from,
				end_date_time: date_to,
				per_page: limit,
				page_cursor: cursor,
			},
		),
	);

	if (requestError) {
		const error =
			requestError instanceof DerivRestError
				? new RequestError(requestError.statusCode, requestError.message)
				: requestError;

		return handleError(error, "api");
	}

	const transactions = action_type
		? response.data.transactions.filter(
				(transaction) => transaction.category === action_type,
			)
		: response.data.transactions;

	const nextLink = response.links?.next ?? null;

	return NextResponse.json(
		{
			success: true,
			data: {
				transactions,
				nextCursor: extractPageCursor(nextLink),
				hasMore: nextLink !== null,
			},
		},
		{ status: 200 },
	);
};
