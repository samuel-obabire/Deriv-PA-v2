import type { Transaction } from "@repo/db";
import type { PaginationCursor } from "@repo/db/queries";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type TransactionsPage = {
	transactions: Transaction[];
	cursor?: PaginationCursor;
};

// `initialTransactions` should only be passed for the default (unfiltered)
// search params — seeding it for a filtered key would show the unfiltered
// server-rendered page instead of fetching that filter combination.
export const transactionsQueryOptions = (
	stringifiedSearchParams: string,
	initialTransactions?: Transaction[],
) =>
	infiniteQueryOptions({
		queryKey: ["transactions", stringifiedSearchParams],

		initialPageParam: undefined,

		...(initialTransactions && {
			initialData: {
				pageParams: [undefined],
				pages: [
					{
						transactions: initialTransactions,
						cursor: initialTransactions[initialTransactions.length - 1],
					},
				],
			},
		}),

		queryFn: async ({ pageParam }): Promise<TransactionsPage> => {
			const res = await api.transactionService.getTransactions(
				stringifiedSearchParams,
				pageParam,
			);

			if (!res.success) {
				throw new Error(res.error?.message);
			}

			return res.data as TransactionsPage;
		},
		retry: 1,
		staleTime: Infinity,
		getNextPageParam: (lastPage: TransactionsPage) => lastPage.cursor,

		select: (data) => {
			return data.pages?.flatMap?.((page) => page.transactions);
		},
	});
