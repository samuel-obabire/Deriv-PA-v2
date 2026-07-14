"use client";

import { useContext } from "react";
import { TransactionFiltersContext } from "@/context/TransactionFiltersProvider";

const useTransactionFilters = () => {
	const context = useContext(TransactionFiltersContext);

	if (!context)
		throw new Error(
			"useTransactionFilters must be called within TransactionFiltersProvider",
		);

	return context;
};

export default useTransactionFilters;
