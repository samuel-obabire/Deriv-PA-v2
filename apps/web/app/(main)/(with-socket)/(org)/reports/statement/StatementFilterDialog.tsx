"use client";

import { STATEMENT_ACTION_TYPE } from "@repo/deriv";
import {
	Button,
	Calendar,
	ConfirmDialog,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
} from "@repo/ui";
import { endOfDay, format, getUnixTime } from "date-fns";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { FilteredStatementOptions } from "@/hooks/useStatementList";
import { StatementDate } from "./StatementFilter";

const StatementFilterDialog = ({
	statementFilters,
	onDateChange,
	onActionTypeChange,
	onApply,
	onReset,
	activeFilterCount,
}: {
	statementFilters: FilteredStatementOptions;
	onDateChange: (newDate: StatementDate) => void;
	onActionTypeChange: (val: string) => void;
	onApply: () => void;
	onReset: () => void;
	activeFilterCount: number;
}) => {
	const [date, setDate] = useState<DateRange>({
		from: new Date(),
		to: undefined,
	});
	const [selectedType, setSelectedType] = useState<string>(
		statementFilters.action_type ?? "all",
	);

	const handleDateChange = (dateRange: DateRange) => {
		const date_from = dateRange?.from ? getUnixTime(dateRange.from) : undefined;
		const date_to = dateRange?.to
			? getUnixTime(endOfDay(dateRange.to))
			: undefined;
		setDate(dateRange);
		onDateChange({ dateFrom: date_from, dateTo: date_to });
	};

	const handleReset = () => {
		setDate({ from: new Date(), to: undefined });
		setSelectedType("all");
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
			title="Filter Transactions"
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

				<Separator />

				<div className="space-y-2">
					<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Transaction Type
					</Label>
					<Select
						value={selectedType}
						onValueChange={(val) => {
							setSelectedType(val);
							onActionTypeChange(val);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="All types" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All types</SelectItem>
							{STATEMENT_ACTION_TYPE.map((type) => (
								<SelectItem key={type} value={type}>
									{type.charAt(0).toUpperCase() +
										type.slice(1).replace(/_/g, " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</ConfirmDialog>
	);
};

export default StatementFilterDialog;
