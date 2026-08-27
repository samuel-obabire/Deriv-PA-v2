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
	const [ngnAmount, setNgnAmount] = useState<string>(
		filters.ngnAmount?.toString() ?? "",
	);
	const [clientId, setClientId] = useState<string>(filters.clientId ?? "");

	const onApply = () => {
		applyFilters({
			status,
			date_from: date?.dateFrom,
			date_to: date?.dateTo,
			amount: amount ? Number(amount) : undefined,
			ngnAmount: ngnAmount ? Number(ngnAmount) : undefined,
			clientId: clientId.trim() ? clientId.trim() : undefined,
		});
	};

	const onReset = () => {
		setDate(undefined);
		setStatus(undefined);
		setAmount("");
		setNgnAmount("");
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
		filters.ngnAmount,
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
				ngnAmount={ngnAmount}
				onNgnAmountChange={setNgnAmount}
				clientId={clientId}
				onClientIdChange={setClientId}
				activeFilterCount={activeFilterCount}
			/>
		</div>
	);
}
