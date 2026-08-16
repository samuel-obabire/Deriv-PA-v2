"use client";

import { useState } from "react";
import useDailySummaryFilters from "@/hooks/useDailySummaryFilters";
import DailySummaryFilterDialog from "./DailySummaryFilterDialog";

export type DailySummaryDate = {
	dateFrom?: Date;
	dateTo?: Date;
};

export function DailySummaryFilter() {
	const [date, setDate] = useState<DailySummaryDate>();
	const { filters, applyFilters } = useDailySummaryFilters();

	const onApply = () => {
		applyFilters({
			date_from: date?.dateFrom,
			date_to: date?.dateTo,
		});
	};

	const onReset = () => {
		setDate(undefined);
		applyFilters({});
	};

	const handleDateChange = (newDate: DailySummaryDate) => {
		setDate(newDate);
	};

	const activeFilterCount = [filters.date_from].filter(Boolean).length;

	return (
		<div>
			<DailySummaryFilterDialog
				onApply={onApply}
				onReset={onReset}
				dailySummaryFilters={filters}
				onDateChange={handleDateChange}
				activeFilterCount={activeFilterCount}
			/>
		</div>
	);
}
