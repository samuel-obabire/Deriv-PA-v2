"use client";

import type { DailySummaryPaginationOption } from "@repo/db/queries";
import { createContext, PropsWithChildren, useState } from "react";

export type DailySummaryFilters = Pick<
	DailySummaryPaginationOption,
	"date_from" | "date_to"
>;

type DailySummaryFiltersContextValue = {
	filters: DailySummaryFilters;
	applyFilters: (f: DailySummaryFilters) => void;
};

export const DailySummaryFiltersContext =
	createContext<DailySummaryFiltersContextValue | null>(null);

const DailySummaryFiltersProvider = ({ children }: PropsWithChildren) => {
	const [filters, setFilters] = useState<DailySummaryFilters>({});

	const applyFilters = (f: DailySummaryFilters) => {
		setFilters(f);
	};

	return (
		<DailySummaryFiltersContext.Provider value={{ filters, applyFilters }}>
			{children}
		</DailySummaryFiltersContext.Provider>
	);
};

export default DailySummaryFiltersProvider;
