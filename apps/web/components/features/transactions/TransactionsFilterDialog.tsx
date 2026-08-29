"use client";

import { TRANSACTION_STATUS } from "@repo/db/enums";
import {
	Button,
	Calendar,
	ConfirmDialog,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Switch,
} from "@repo/ui";
import { endOfDay, format } from "date-fns";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { TransactionFilters } from "@/context/TransactionFiltersProvider";
import { TransactionDate } from "./TransactionsFilter";

const TransactionsFilterDialog = ({
	transactionFilters,
	onDateChange,
	status,
	onStatusChange,
	amount,
	onAmountChange,
	ngnAmount,
	onNgnAmountChange,
	clientId,
	onClientIdChange,
	hasNotes,
	onHasNotesChange,
	onApply,
	onReset,
	activeFilterCount,
}: {
	transactionFilters: TransactionFilters;
	onDateChange: (newDate: TransactionDate) => void;
	status?: TRANSACTION_STATUS;
	onStatusChange: (val: string) => void;
	amount: string;
	onAmountChange: (val: string) => void;
	ngnAmount: string;
	onNgnAmountChange: (val: string) => void;
	clientId: string;
	onClientIdChange: (val: string) => void;
	hasNotes: boolean;
	onHasNotesChange: (val: boolean) => void;
	onApply: () => void;
	onReset: () => void;
	activeFilterCount: number;
}) => {
	const [date, setDate] = useState<DateRange>({
		from: transactionFilters.date_from,
		to: transactionFilters.date_to,
	});
	const [selectedStatus, setSelectedStatus] = useState<string>(
		transactionFilters.status ?? "all",
	);

	const handleDateChange = (dateRange: DateRange) => {
		const dateFrom = dateRange?.from;
		const dateTo = dateRange?.to ? endOfDay(dateRange.to) : undefined;
		setDate(dateRange);
		onDateChange({ dateFrom, dateTo });
	};

	const handleReset = () => {
		setDate({ from: undefined, to: undefined });
		setSelectedStatus("all");
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
						Status
					</Label>
					<Select
						value={selectedStatus}
						onValueChange={(val) => {
							setSelectedStatus(val);
							onStatusChange(val);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							{Object.values(TRANSACTION_STATUS).map((value) => (
								<SelectItem key={value} value={value}>
									{value.charAt(0).toUpperCase() + value.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label
						htmlFor="transaction-amount"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						USD Amount
					</Label>
					<Input
						id="transaction-amount"
						type="text"
						placeholder="Exact USD amount"
						value={amount}
						onChange={(e) => onAmountChange(e.target.value)}
						autoComplete="off"
					/>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label
						htmlFor="transaction-ngn-amount"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						NGN Amount
					</Label>
					<Input
						id="transaction-ngn-amount"
						type="text"
						placeholder="Exact NGN amount"
						value={ngnAmount}
						onChange={(e) => onNgnAmountChange(e.target.value)}
						autoComplete="off"
					/>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label
						htmlFor="transaction-client"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						Client Nickname
					</Label>
					<Input
						id="transaction-client"
						placeholder="e.g. client_eee"
						value={clientId}
						onChange={(e) => onClientIdChange(e.target.value)}
						autoComplete="off"
					/>
				</div>

				<Separator />

				<div className="flex items-center justify-between gap-2">
					<Label
						htmlFor="transaction-has-notes"
						className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
					>
						Has Notes
					</Label>
					<Switch
						id="transaction-has-notes"
						checked={hasNotes}
						onCheckedChange={onHasNotesChange}
					/>
				</div>
			</div>
		</ConfirmDialog>
	);
};

export default TransactionsFilterDialog;
