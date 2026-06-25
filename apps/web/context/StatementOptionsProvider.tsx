"use client";

import { createContext, PropsWithChildren } from "react";
import useStatementList, {
	FilteredStatementOptions,
} from "@/hooks/useStatementList";
import type { StatementTransaction } from "@/lib/utils/statement";

type StatementContextValue = {
	transactions: StatementTransaction[];
	isLoading: boolean;
	sentinelRef: (node?: Element | null) => void;
	currency: string | null | undefined;
	isConnecting: boolean;
	isEmpty: boolean;
	filters: FilteredStatementOptions;
	applyFilters: (f: FilteredStatementOptions) => void;
};

export const StatementContext = createContext<StatementContextValue | null>(
	null,
);

const StatementOptionsProvider = ({ children }: PropsWithChildren) => {
	const statementList = useStatementList();

	return (
		<StatementContext.Provider value={statementList}>
			{children}
		</StatementContext.Provider>
	);
};

export default StatementOptionsProvider;
