"use client";

import { DailySummary } from "@repo/db";
import { DailySummaryPaginationOption } from "@repo/db/queries";
import { DataRenderer, Spinner } from "@repo/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useInfiniteScrollSentinel from "@/hooks/useInfiniteScrollSentinel";
import { dailySummaryQueryOptions } from "@/lib/queryOptions/dailySummary";
import { buildDailySummarySearchParams } from "@/lib/utils/dailySummary";
import DailySummaryListCard from "./DailySummaryListCard";

type DailySummaryListProps = {
	initialSummaries: DailySummary[];
	filters: Pick<DailySummaryPaginationOption, "date_from" | "date_to">;
};

const DailySummaryList = ({
	initialSummaries,
	filters,
}: DailySummaryListProps) => {
	const { ref, inView } = useInfiniteScrollSentinel();

	const stringifiedSearchParams = buildDailySummarySearchParams(filters);
	const isUnfiltered = stringifiedSearchParams === "";

	const {
		data,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery(
		dailySummaryQueryOptions(
			stringifiedSearchParams,
			isUnfiltered ? initialSummaries : undefined,
		),
	);

	useEffect(() => {
		if (inView && !isFetchingNextPage && hasNextPage && !error) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, hasNextPage, isFetchingNextPage, error]);

	const summaries = data ?? [];

	if (isLoading) {
		return (
			<div className="mt-8 flex justify-center">
				<Spinner className="size-6" />
			</div>
		);
	}

	return (
		<DataRenderer
			data={summaries}
			error={error}
			empty={{ title: "No daily summaries found." }}
			render={(summaries) => (
				<section className="space-y-1 py-4 px-1">
					{summaries.map((summary) => (
						<DailySummaryListCard key={summary.id} summary={summary} />
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

export default DailySummaryList;
