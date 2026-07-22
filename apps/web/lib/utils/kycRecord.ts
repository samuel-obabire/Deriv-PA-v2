import type { KycRecordFilters } from "@/context/KycRecordFiltersProvider";

export const buildKycRecordSearchParams = (filters: KycRecordFilters) => {
	const { email, externalReferenceId, derivNickname, name } = filters;

	const searchParams = new URLSearchParams();

	if (email) searchParams.append("email", email);
	if (externalReferenceId)
		searchParams.append("externalReferenceId", externalReferenceId);
	if (derivNickname) searchParams.append("derivNickname", derivNickname);
	if (name) searchParams.append("name", name);

	return searchParams.toString();
};
