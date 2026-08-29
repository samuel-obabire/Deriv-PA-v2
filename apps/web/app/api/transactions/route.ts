import { getTransactions, PAGE_LIMIT } from "@repo/db/queries";
import { ForbiddenError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";

import { getSearchParamsFromRequest } from "@/lib/utils/getSearchParamsFromRequest";
import { TransactionQuerySchema } from "@/lib/validations/pagination";

export const GET = async (req: NextRequest) => {
	const searchParams = getSearchParamsFromRequest(req);

	const [actionResult, actionError] = await tryCatch(() =>
		action({
			params: searchParams,
			schema: TransactionQuerySchema,
		}),
	);

	if (actionError) return handleError(actionError, "api");

	const [permitted, permissionError] = await tryCatch(() =>
		hasPermission({ statement: ["view"] }),
	);

	if (permissionError) return handleError(permissionError, "api");
	if (!permitted.success) {
		return handleError(new ForbiddenError("Transactions"), "api");
	}

	const organizationId = actionResult.session?.session
		.activeOrganizationId as string;

	const {
		cursorDate,
		cursorId,
		limit = PAGE_LIMIT,
		date_from,
		date_to,
		status,
		amount,
		ngnAmount,
		clientId,
		hasNotes,
	} = actionResult.params;

	const fn = getTransactions({
		db,
		organizationId,
		paginationOptions: {
			limit,
			date_from,
			date_to,
			status,
			amount,
			ngnAmount,
			clientId,
			hasNotes,
			...(cursorDate &&
				cursorId && {
					cursor: {
						createdAt: cursorDate,
						id: cursorId,
					},
				}),
		},
	});

	const [transactions, getTnxErr] = await tryCatch(() => fn);

	if (getTnxErr) return handleError(getTnxErr, "api");

	return NextResponse.json(
		{
			success: true,
			data: {
				transactions,
				cursor:
					transactions.length === PAGE_LIMIT
						? transactions[transactions.length - 1]
						: undefined,
			},
		},
		{
			status: 200,
		},
	);
};
