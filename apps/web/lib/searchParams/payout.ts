import {
	createSearchParamsCache,
	parseAsInteger,
	parseAsIsoDate,
	parseAsString,
} from "nuqs/server";

export const payoutSearchParams = {
	from: parseAsIsoDate,
	to: parseAsIsoDate,
	status: parseAsString,
	limit: parseAsInteger,
	searchQuery: parseAsString,
};

export const payoutSearchParamsCache =
	createSearchParamsCache(payoutSearchParams);
