import { PayoutStatus } from "@repo/db";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Options, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { useDebounce } from "react-use";

const queryStateOptions: Options = {
	history: "replace",
	clearOnDefault: true,
	shallow: false,
};

const useFilters = () => {
	const [filters, setFilters] = useQueryStates(
		{
			status: parseAsString,
			searchQuery: parseAsString,
		},
		queryStateOptions,
	);

	const [query, setQuery] = useState<null | string>(
		filters.searchQuery ?? null,
	);

	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	// debounce updates to query state to prevent multiple reloads
	useDebounce(
		() => {
			if (query === null) return;
			setFilters({
				searchQuery: query || null,
			});
		},
		1000,
		[query],
	);

	const onSearchSubmit = () => {
		setFilters({
			searchQuery: query,
		});
	};

	const onSearchClear = () => {
		setQuery(null);
		setFilters({
			searchQuery: null,
		});
	};

	const clearFilters = () => {
		if (searchParams.toString()) {
			setFilters({});
			setQuery(null);

			router.replace(pathname);
		}
	};

	const setStatus = (status: PayoutStatus) => {
		setFilters({
			status,
		});
	};

	return {
		query,
		setQuery,
		onSearchClear,
		setStatus,
		onSearchSubmit,
		clearFilters,
	};
};

export default useFilters;
