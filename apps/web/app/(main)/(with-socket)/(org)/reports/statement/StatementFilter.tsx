"use client";

import { StatementActionType } from "@repo/deriv";
import { useState } from "react";
import useStatementOptions from "@/hooks/useStatementOptions";
import StatementFilterDialog from "./StatementFilterDialog";

export type StatementDate = {
	dateFrom?: number | undefined;
	dateTo: number | undefined;
};

export function StatementFilter() {
	const [date, setDate] = useState<StatementDate>();
	const { filters, applyFilters } = useStatementOptions();
	const [actionType, setActionType] = useState<StatementActionType | undefined>(
		filters.action_type,
	);

	const onApply = () => {
		applyFilters({
			action_type: actionType,
			date_from: date?.dateFrom,
			date_to: date?.dateTo,
		});
	};

	const onReset = () => {
		setDate(undefined);
		setActionType(undefined);
		applyFilters({});
	};

	const handleDateChange = (newDate: StatementDate) => {
		setDate(newDate);
	};

	const handleActionTypeChange = (val: string) => {
		setActionType(val === "all" ? undefined : (val as StatementActionType));
	};

	const activeFilterCount = [filters.action_type, filters.date_from].filter(
		Boolean,
	).length;

	return (
		<div>
			<StatementFilterDialog
				onApply={onApply}
				onReset={onReset}
				statementFilters={filters}
				onActionTypeChange={handleActionTypeChange}
				onDateChange={handleDateChange}
				activeFilterCount={activeFilterCount}
			/>
		</div>
	);
}
