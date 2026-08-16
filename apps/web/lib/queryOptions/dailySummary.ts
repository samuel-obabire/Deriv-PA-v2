import type { DailySummary } from "@repo/db";
import type { DailySummaryCursor } from "@repo/db/queries";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type DailySummaryPage = {
	summaries: DailySummary[];
	cursor?: DailySummaryCursor;
};

// `initialSummaries` should only be passed for the default (unfiltered)
// search params — seeding it for a filtered key would show the unfiltered
// server-rendered page instead of fetching that filter combination.
export const dailySummaryQueryOptions = (
	stringifiedSearchParams: string,
	initialSummaries?: DailySummary[],
) =>
	infiniteQueryOptions({
		queryKey: ["daily-summary", stringifiedSearchParams],

		initialPageParam: undefined,

		...(initialSummaries && {
			initialData: {
				pageParams: [undefined],
				pages: [
					{
						summaries: initialSummaries,
						cursor: initialSummaries[initialSummaries.length - 1],
					},
				],
			},
		}),

		queryFn: async ({ pageParam }): Promise<DailySummaryPage> => {
			const res = await api.dailySummaryService.getDailySummaries(
				stringifiedSearchParams,
				pageParam,
			);

			if (!res.success) {
				throw new Error(res.error?.message);
			}

			return res.data as DailySummaryPage;
		},
		retry: 1,
		getNextPageParam: (lastPage: DailySummaryPage) => lastPage.cursor,

		select: (data) => {
			return data.pages?.flatMap?.((page) => page.summaries);
		},
	});
