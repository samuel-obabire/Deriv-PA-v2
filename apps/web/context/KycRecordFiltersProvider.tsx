"use client";

import type { KycRecordPaginationOption } from "@repo/db/queries";
import { createContext, PropsWithChildren, useState } from "react";

export type KycRecordFilters = Pick<
	KycRecordPaginationOption,
	"email" | "externalReferenceId" | "derivNickname"
>;

type KycRecordFiltersContextValue = {
	filters: KycRecordFilters;
	applyFilters: (f: KycRecordFilters) => void;
};

export const KycRecordFiltersContext =
	createContext<KycRecordFiltersContextValue | null>(null);

const KycRecordFiltersProvider = ({ children }: PropsWithChildren) => {
	const [filters, setFilters] = useState<KycRecordFilters>({});

	const applyFilters = (f: KycRecordFilters) => {
		setFilters(f);
	};

	return (
		<KycRecordFiltersContext.Provider value={{ filters, applyFilters }}>
			{children}
		</KycRecordFiltersContext.Provider>
	);
};

export default KycRecordFiltersProvider;
