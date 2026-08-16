import { DailySummary } from "@repo/db";
import { DailySummaryCursor } from "@repo/db/queries";
import fetchHandler from "@repo/lib/handlers/fetch";
import { ActionResponse } from "@repo/lib/types";
import { clientEnv } from "../validations/env/client";

const getDailySummaryUrl = (
	searchParams?: string,
	cursor?: DailySummaryCursor | null,
) => {
	const params = new URLSearchParams(searchParams);

	if (cursor) {
		params.set("cursorId", cursor.id);
		params.set(
			"cursorBusinessDate",
			new Date(cursor.businessDate).toISOString(),
		);
	}

	return `${clientEnv.NEXT_PUBLIC_URL}/api/daily-summary?${params.toString()}`;
};

export type FetchDailySummaryResponse = ActionResponse<{
	summaries: DailySummary[];
	cursor?: DailySummaryCursor;
}>;

export const dailySummaryService = {
	getDailySummaries: async (
		searchParams: string,
		cursor?: DailySummaryCursor,
	) => {
		return fetchHandler<FetchDailySummaryResponse>(
			getDailySummaryUrl(searchParams, cursor),
		);
	},
};
