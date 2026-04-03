import { getPayouts, PAGE_LIMIT } from "@repo/db/queries";
import { tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import handleError from "@/lib/http-errors";
import { FetchPaginatedPayoutSchema } from "@/lib/validations/api";
import { getSearchParamsFromRequest } from "@/utils/getSearchParamsFromRequest";

export const GET = async (req: NextRequest) => {
	const searchParams = getSearchParamsFromRequest(req);

	const result = await tryCatch(
		action({
			params: searchParams,
			schema: FetchPaginatedPayoutSchema,
			authorise: true,
		}),
	);

	if (result.error) return handleError(result.error, "api");

	const {
		cursorDate,
		cursorId,
		limit = PAGE_LIMIT,
		searchQuery,
		status,
		from,
		to,
	} = result.data.params;

	const fn = getPayouts({
		db,
		options: {
			searchQuery,
			status,
			limit,
			...(cursorDate &&
				cursorId && {
					cursor: {
						createdAt: cursorDate,
						id: cursorId,
					},
				}),
			...(from &&
				to && {
					date: { from, to },
				}),
		},
	});

	const { data: transactions, error: getPayoutError } = await tryCatch(fn);

	if (getPayoutError) return handleError(getPayoutError, "api");

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
