"use client";

import { useContext } from "react";
import { DailySummaryFiltersContext } from "@/context/DailySummaryFiltersProvider";

const useDailySummaryFilters = () => {
	const context = useContext(DailySummaryFiltersContext);

	if (!context)
		throw new Error(
			"useDailySummaryFilters must be called within DailySummaryFiltersProvider",
		);

	return context;
};

export default useDailySummaryFilters;
