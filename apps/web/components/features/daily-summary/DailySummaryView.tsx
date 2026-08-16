"use client";

import type { DailySummary } from "@repo/db";
import useDailySummaryFilters from "@/hooks/useDailySummaryFilters";
import DailySummaryList from "./DailySummaryList";

type Props = {
	initialSummaries: DailySummary[];
};

const DailySummaryView = ({ initialSummaries }: Props) => {
	const { filters } = useDailySummaryFilters();

	return (
		<DailySummaryList initialSummaries={initialSummaries} filters={filters} />
	);
};

export default DailySummaryView;
