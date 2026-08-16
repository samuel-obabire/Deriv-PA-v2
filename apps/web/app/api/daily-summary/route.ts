import { getDailySummaries, PAGE_LIMIT } from "@repo/db/queries";
import { ForbiddenError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";

import { getSearchParamsFromRequest } from "@/lib/utils/getSearchParamsFromRequest";
import { DailySummaryQuerySchema } from "@/lib/validations/pagination";

export const GET = async (req: NextRequest) => {
	const searchParams = getSearchParamsFromRequest(req);

	const [actionResult, actionError] = await tryCatch(() =>
		action({
			params: searchParams,
			schema: DailySummaryQuerySchema,
		}),
	);

	if (actionError) return handleError(actionError, "api");

	const [permitted, permissionError] = await tryCatch(() =>
		hasPermission({ summary: ["view"] }),
	);

	if (permissionError) return handleError(permissionError, "api");
	if (!permitted.success) {
		return handleError(new ForbiddenError("Daily Summary"), "api");
	}

	const organizationId = actionResult.session?.session
		.activeOrganizationId as string;

	const {
		cursorBusinessDate,
		cursorId,
		limit = PAGE_LIMIT,
		date_from,
		date_to,
	} = actionResult.params;

	const fn = getDailySummaries({
		db,
		organizationId,
		paginationOptions: {
			limit,
			date_from,
			date_to,
			...(cursorBusinessDate &&
				cursorId && {
					cursor: {
						businessDate: cursorBusinessDate,
						id: cursorId,
					},
				}),
		},
	});

	const [summaries, getSummariesErr] = await tryCatch(() => fn);

	if (getSummariesErr) return handleError(getSummariesErr, "api");

	return NextResponse.json(
		{
			success: true,
			data: {
				summaries,
				cursor:
					summaries.length === limit
						? summaries[summaries.length - 1]
						: undefined,
			},
		},
		{
			status: 200,
		},
	);
};
