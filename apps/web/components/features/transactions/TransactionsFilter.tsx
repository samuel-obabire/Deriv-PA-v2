"use client";

import { TRANSACTION_STATUS } from "@repo/db/enums";
import { useState } from "react";
import useTransactionFilters from "@/hooks/useTransactionFilters";
import TransactionsFilterDialog from "./TransactionsFilterDialog";

export type TransactionDate = {
	dateFrom?: Date;
	dateTo?: Date;
};

export function TransactionsFilter() {
	const [date, setDate] = useState<TransactionDate>();
	const { filters, applyFilters } = useTransactionFilters();
	const [status, setStatus] = useState<TRANSACTION_STATUS | undefined>(
		filters.status,
	);
	const [amount, setAmount] = useState<string>(
		filters.amount?.toString() ?? "",
	);
	const [clientId, setClientId] = useState<string>(filters.clientId ?? "");

	const onApply = () => {
		applyFilters({
			status,
			date_from: date?.dateFrom,
			date_to: date?.dateTo,
			amount: amount ? Number(amount) : undefined,
			clientId: clientId.trim() ? clientId.trim() : undefined,
		});
	};

	const onReset = () => {
		setDate(undefined);
		setStatus(undefined);
		setAmount("");
		setClientId("");
		applyFilters({});
	};

	const handleDateChange = (newDate: TransactionDate) => {
		setDate(newDate);
	};

	const handleStatusChange = (val: string) => {
		setStatus(val === "all" ? undefined : (val as TRANSACTION_STATUS));
	};

	const activeFilterCount = [
		filters.status,
		filters.date_from,
		filters.amount,
		filters.clientId,
	].filter(Boolean).length;

	return (
		<div>
			<TransactionsFilterDialog
				onApply={onApply}
				onReset={onReset}
				transactionFilters={filters}
				status={status}
				onStatusChange={handleStatusChange}
				onDateChange={handleDateChange}
				amount={amount}
				onAmountChange={setAmount}
				clientId={clientId}
				onClientIdChange={setClientId}
				activeFilterCount={activeFilterCount}
			/>
		</div>
	);
}
