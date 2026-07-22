"use client";

import { useContext } from "react";
import { KycRecordFiltersContext } from "@/context/KycRecordFiltersProvider";

const useKycRecordFilters = () => {
	const context = useContext(KycRecordFiltersContext);

	if (!context)
		throw new Error(
			"useKycRecordFilters must be called within KycRecordFiltersProvider",
		);

	return context;
};

export default useKycRecordFilters;
