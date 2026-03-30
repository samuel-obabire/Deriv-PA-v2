"use client";

import { type PayoutRequest } from "@repo/db";
import { Cursor } from "@repo/db/queries";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "@/lib/api";
import { FetchPayoutResponse } from "@/lib/types/actions";
import TransactionsListCard from "./TransactionsListCard";

type TransactionsListProp = {
	transactions: PayoutRequest[];
};

type Res = {
	transactions: PayoutRequest[];
	cursor: Cursor | undefined;
};

const TransactionsList = ({ transactions }: TransactionsListProp) => {
	const { ref, inView } = useInView({
		threshold: 0.01,

		rootMargin: "0px 0px 10px 0px",
	});

	const { data, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteQuery<Res, Error, InfiniteData<Res>, string[], Cursor | null>({
			queryKey: ["payouts"],

			initialPageParam: null,

			initialData: {
				pageParams: [null],
				pages: [
					{
						transactions,
						cursor: transactions[transactions.length - 1],
					},
				],
			},

			queryFn: async ({ pageParam }) => {
				const res = await api.fetchPayouts<FetchPayoutResponse>(pageParam);

				if (!res.success) {
					throw new Error(res.error?.message);
				}

				return res.data as Res;
			},
			retry: 1,
			staleTime: Infinity,
			getNextPageParam: (lastPage) => {
				return lastPage.cursor ?? undefined;
			},
		});

	useEffect(() => {
		if (inView && !isFetchingNextPage && hasNextPage && !error) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, hasNextPage, isFetchingNextPage, error]);

	const t = data?.pages.flatMap((page) => page.transactions) ?? [];

	return (
		<section className="space-y-3 px-1">
			{t.map((tx) => {
				const { id, ...otherProps } = tx;

				return <TransactionsListCard key={id} {...otherProps} />;
			})}

			{hasNextPage && <div className="h-1" ref={ref}></div>}
			{isFetchingNextPage && <div>Fetching next page...</div>}
		</section>
	);
};

export default TransactionsList;
