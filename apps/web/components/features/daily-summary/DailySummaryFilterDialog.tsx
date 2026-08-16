"use client";

import { Button, Calendar, ConfirmDialog, Label } from "@repo/ui";
import { format } from "date-fns";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DailySummaryFilters } from "@/context/DailySummaryFiltersProvider";
import { DailySummaryDate } from "./DailySummaryFilter";

const DailySummaryFilterDialog = ({
	dailySummaryFilters,
	onDateChange,
	onApply,
	onReset,
	activeFilterCount,
}: {
	dailySummaryFilters: DailySummaryFilters;
	onDateChange: (newDate: DailySummaryDate) => void;
	onApply: () => void;
	onReset: () => void;
	activeFilterCount: number;
}) => {
	const [date, setDate] = useState<DateRange>({
		from: dailySummaryFilters.date_from,
		to: dailySummaryFilters.date_to,
	});

	const handleDateChange = (dateRange: DateRange) => {
		const dateFrom = dateRange?.from;
		const dateTo = dateRange?.to;
		setDate(dateRange);
		onDateChange({ dateFrom, dateTo });
	};

	const handleReset = () => {
		setDate({ from: undefined, to: undefined });
		onReset();
	};

	const trigger = (
		<Button variant="outline" size="sm" className="gap-2">
			<SlidersHorizontal className="size-4" />
			<span>Filters</span>
			{activeFilterCount > 0 && (
				<span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
					{activeFilterCount}
				</span>
			)}
		</Button>
	);

	return (
		<ConfirmDialog
			trigger={trigger}
			title="Filter Daily Summaries"
			confirmLabel="Apply Filters"
			cancelLabel="Reset"
			onConfirm={onApply}
			onCancel={handleReset}
		>
			<div className="space-y-5">
				<div className="space-y-2">
					<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Date Range
					</Label>
					<div className="flex justify-center">
						<Calendar
							mode="range"
							required
							defaultMonth={date?.from}
							selected={date}
							onSelect={handleDateChange}
							numberOfMonths={1}
							className="rounded-xl border p-2"
						/>
					</div>
					<p className="text-center text-xs text-muted-foreground">
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "MMM d, yyyy")} &mdash;{" "}
									{format(date.to, "MMM d, yyyy")}
								</>
							) : (
								<>From {format(date.from, "MMM d, yyyy")}</>
							)
						) : (
							"No date selected"
						)}
					</p>
				</div>
			</div>
		</ConfirmDialog>
	);
};

export default DailySummaryFilterDialog;
