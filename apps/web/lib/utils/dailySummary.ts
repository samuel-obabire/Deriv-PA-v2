import type { DailySummaryFilters } from "@/context/DailySummaryFiltersProvider";
import { toBusinessDateUTC } from "@/lib/utils/date";

export const buildDailySummarySearchParams = (filters: DailySummaryFilters) => {
	const { date_from, date_to } = filters;

	const searchParams = new URLSearchParams();

	if (date_from)
		searchParams.append(
			"date_from",
			toBusinessDateUTC(date_from).toISOString(),
		);
	if (date_to)
		searchParams.append("date_to", toBusinessDateUTC(date_to).toISOString());

	return searchParams.toString();
};
