import type { ClientKycRecord } from "@repo/db";
import type { PaginationCursor } from "@repo/db/queries";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type KycRecordsPage = {
	records: ClientKycRecord[];
	cursor?: PaginationCursor;
};

// `initialRecords` should only be passed for the default (unfiltered)
// search params — seeding it for a filtered key would show the unfiltered
// server-rendered page instead of fetching that filter combination.
export const kycRecordsQueryOptions = (
	stringifiedSearchParams: string,
	initialRecords?: ClientKycRecord[],
) =>
	infiniteQueryOptions({
		queryKey: ["kyc-records", stringifiedSearchParams],

		initialPageParam: undefined,

		...(initialRecords && {
			initialData: {
				pageParams: [undefined],
				pages: [
					{
						records: initialRecords,
						cursor: initialRecords[initialRecords.length - 1],
					},
				],
			},
		}),

		queryFn: async ({ pageParam }): Promise<KycRecordsPage> => {
			const res = await api.kycRecordService.getKycRecords(
				stringifiedSearchParams,
				pageParam,
			);

			if (!res.success) {
				throw new Error(res.error?.message);
			}

			return res.data as KycRecordsPage;
		},
		retry: 1,
		getNextPageParam: (lastPage: KycRecordsPage) => lastPage.cursor,

		select: (data) => {
			return data.pages?.flatMap?.((page) => page.records);
		},
	});
