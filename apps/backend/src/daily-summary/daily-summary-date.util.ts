import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { LAGOS_TZ } from "./constants";

export type BusinessDateRange = {
	businessDate: Date;
	startUtc: Date;
	endUtc: Date;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const businessDateKey = (businessDate: Date): string =>
	businessDate.toISOString().slice(0, 10);

const parseBusinessDateKey = (key: string): Date =>
	new Date(`${key}T00:00:00.000Z`);

export const getBusinessDateRangeForDate = (
	businessDate: Date,
): BusinessDateRange => {
	const key = businessDateKey(businessDate);
	const nextKey = businessDateKey(new Date(businessDate.getTime() + DAY_MS));

	return {
		businessDate,
		startUtc: fromZonedTime(key, LAGOS_TZ),
		endUtc: fromZonedTime(nextKey, LAGOS_TZ),
	};
};

export const getBusinessDateRange = (
	referenceDate: Date,
	daysAgo: number,
): BusinessDateRange => {
	const todayKey = formatInTimeZone(referenceDate, LAGOS_TZ, "yyyy-MM-dd");
	const businessDate = new Date(
		parseBusinessDateKey(todayKey).getTime() - daysAgo * DAY_MS,
	);

	return getBusinessDateRangeForDate(businessDate);
};

export const dailySummaryJobId = (
	organizationId: string,
	businessDate: Date,
): string => `daily-summary-${organizationId}-${businessDateKey(businessDate)}`;

export const dailySummaryKey = (
	organizationId: string,
	businessDate: Date,
): string => `${organizationId}|${businessDateKey(businessDate)}`;
