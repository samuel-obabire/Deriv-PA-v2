"use client";

import type { TransactionPaginationOption } from "@repo/db/queries";
import { createContext, PropsWithChildren, useState } from "react";

export type TransactionFilters = Pick<
	TransactionPaginationOption,
	"date_from" | "date_to" | "status" | "amount" | "clientId"
>;

type TransactionFiltersContextValue = {
	filters: TransactionFilters;
	applyFilters: (f: TransactionFilters) => void;
};

export const TransactionFiltersContext =
	createContext<TransactionFiltersContextValue | null>(null);

const TransactionFiltersProvider = ({ children }: PropsWithChildren) => {
	const [filters, setFilters] = useState<TransactionFilters>({});

	const applyFilters = (f: TransactionFilters) => {
		setFilters(f);
	};

	return (
		<TransactionFiltersContext.Provider value={{ filters, applyFilters }}>
			{children}
		</TransactionFiltersContext.Provider>
	);
};

export default TransactionFiltersProvider;
