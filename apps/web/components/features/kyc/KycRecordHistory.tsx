"use client";

import type { ClientKycRecord } from "@repo/db";
import useKycRecordFilters from "@/hooks/useKycRecordFilters";
import KycRecordsList from "./KycRecordsList";

type Props = {
	initialRecords: ClientKycRecord[];
};

const KycRecordHistory = ({ initialRecords }: Props) => {
	const { filters } = useKycRecordFilters();

	return <KycRecordsList initialRecords={initialRecords} filters={filters} />;
};

export default KycRecordHistory;
