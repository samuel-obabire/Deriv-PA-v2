"use client";

import type { ClientKycRecord } from "@repo/db";
import { DataRenderer, Spinner } from "@repo/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { KycRecordFilters } from "@/context/KycRecordFiltersProvider";
import useInfiniteScrollSentinel from "@/hooks/useInfiniteScrollSentinel";
import { kycRecordsQueryOptions } from "@/lib/queryOptions/kycRecords";
import { buildKycRecordSearchParams } from "@/lib/utils/kycRecord";
import KycRecordCard from "./KycRecordCard";

type Props = {
	initialRecords: ClientKycRecord[];
	filters: KycRecordFilters;
};

const emptyState = {
	title: "No KYC records yet",
	message:
		"Records created or reviewed for your organization will show up here.",
};

const KycRecordsList = ({ initialRecords, filters }: Props) => {
	const { ref, inView } = useInfiniteScrollSentinel();

	const stringifiedSearchParams = buildKycRecordSearchParams(filters);
	const isUnfiltered = stringifiedSearchParams === "";

	const {
		data,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery(
		kycRecordsQueryOptions(
			stringifiedSearchParams,
			isUnfiltered ? initialRecords : undefined,
		),
	);

	useEffect(() => {
		if (inView && !isFetchingNextPage && hasNextPage && !error) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, hasNextPage, isFetchingNextPage, error]);

	const records = data ?? [];

	if (isLoading) {
		return (
			<div className="mt-8 flex justify-center">
				<Spinner className="size-6" />
			</div>
		);
	}

	return (
		<DataRenderer
			data={records}
			error={error}
			empty={emptyState}
			render={(data) => (
				<div className="space-y-3">
					{data.map((record) => (
						<KycRecordCard key={record.id} record={record} />
					))}

					{hasNextPage && <div className="h-1" ref={ref}></div>}
					{isFetchingNextPage && (
						<div className="mt-4 flex justify-center py-2">
							<Spinner />
						</div>
					)}
				</div>
			)}
		/>
	);
};

export default KycRecordsList;
