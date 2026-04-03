"use client";

import useFilters from "@/hooks/useFilters";
import ClearFilters from "./ClearFilters";
import SearchBar from "./SearchBar";
import StatusFilter from "./StatusFilter";

const AuditFilters = () => {
	const {
		onSearchClear,
		query,
		setQuery,
		setStatus,
		onSearchSubmit,
		clearFilters,
		hasFilter,
	} = useFilters();

	const hasSearch = Boolean(query);

	return (
		<div className="flex flex-col gap-2">
			<SearchBar
				query={query || ""}
				setQuery={setQuery}
				onSearchSubmit={onSearchSubmit}
				onSearchClear={onSearchClear}
				hasSearch={hasSearch}
			/>

			<StatusFilter onSelect={setStatus} />

			<ClearFilters hasFilter={hasFilter} onClear={clearFilters} />
		</div>
	);
};

export default AuditFilters;
