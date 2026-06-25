"use client";

import { STATEMENT_ACTION_TYPE } from "@repo/deriv";
import { endOfDay, format, getUnixTime } from "date-fns";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
	const [open, setOpen] = useState(false);
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

	const handleApply = () => {
		onApply();
		setOpen(false);
	};

	const handleReset = () => {
		setDate({ from: new Date(), to: undefined });
		setSelectedType("all");
		onReset();
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<SlidersHorizontal className="size-4" />
					<span>Filters</span>
					{activeFilterCount > 0 && (
						<span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
							{activeFilterCount}
						</span>
					)}
				</Button>
			</SheetTrigger>

			<SheetContent
				side="bottom"
				showCloseButton={false}
				aria-describedby={undefined}
				className="mx-auto flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-2xl px-0 pb-0"
			>
				<SheetHeader className="shrink-0 border-b px-5 pb-3 pt-1">
					<div className="flex items-center justify-between">
						<SheetTitle className="text-base">Filter Transactions</SheetTitle>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setOpen(false)}
						>
							<X className="size-4" />
						</Button>
					</div>
				</SheetHeader>

				<div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
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

				<SheetFooter className="shrink-0 border-t px-5 py-4">
					<div className="flex w-full gap-3">
						<Button variant="outline" className="flex-1" onClick={handleReset}>
							Reset
						</Button>
						<Button className="flex-1" onClick={handleApply}>
							Apply Filters
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default StatementFilterDialog;
