"use client";

import type { Rate, Transaction } from "@repo/db";
import TransactionsList from "@/components/features/transactions/TransactionsList";
import useTransactionFilters from "@/hooks/useTransactionFilters";

type Props = {
	rate: Rate;
	initialTransactions: Transaction[];
};

const TransactionHistory = ({ rate, initialTransactions }: Props) => {
	const { filters } = useTransactionFilters();

	return (
		<TransactionsList
			initialtransactions={initialTransactions}
			rate={rate}
			filters={filters}
		/>
	);
};

export default TransactionHistory;
