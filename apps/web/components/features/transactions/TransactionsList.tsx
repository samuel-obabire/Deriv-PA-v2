"use client";

import { Rate, Transaction } from "@repo/db";
import { TransactionPaginationOption } from "@repo/db/queries";
import { DataRenderer, Spinner } from "@repo/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useInfiniteScrollSentinel from "@/hooks/useInfiniteScrollSentinel";
import { transactionsQueryOptions } from "@/lib/queryOptions/transactions";
import { buildTransactionSearchParams } from "@/lib/utils/transaction";
import TransactionsListCard from "./TransactionsListCard";

type TransactionsListProp = {
	initialtransactions: Transaction[];
	rate: Rate;
	filters: Pick<
		TransactionPaginationOption,
		"date_from" | "date_to" | "status" | "amount" | "clientId"
	>;
};

const TransactionsList = ({
	initialtransactions,
	rate,
	filters,
}: TransactionsListProp) => {
	const { ref, inView } = useInfiniteScrollSentinel();

	const stringifiedSearchParams = buildTransactionSearchParams(filters);
	const isUnfiltered = stringifiedSearchParams === "";

	const {
		data,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery(
		transactionsQueryOptions(
			stringifiedSearchParams,
			isUnfiltered ? initialtransactions : undefined,
		),
	);

	useEffect(() => {
		if (inView && !isFetchingNextPage && hasNextPage && !error) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, hasNextPage, isFetchingNextPage, error]);

	const t = data ?? [];

	if (isLoading) {
		return (
			<div className="mt-8 flex justify-center">
				<Spinner className="size-6" />
			</div>
		);
	}

	return (
		<DataRenderer
			data={t}
			error={error}
			empty={{ title: "No transactions found." }}
			render={(transactions) => (
				<section className="space-y-1 py-4 px-1">
					{transactions.map((tx) => (
						<TransactionsListCard key={tx.id} transaction={tx} rate={rate} />
					))}

					{hasNextPage && <div className="h-1" ref={ref}></div>}
					{isFetchingNextPage && (
						<div className="mt-4 flex justify-center py-2">
							<Spinner />
						</div>
					)}
				</section>
			)}
		/>
	);
};

export default TransactionsList;
