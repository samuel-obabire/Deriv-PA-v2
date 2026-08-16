import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

export const formatDate = (date: Date) => {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return format(new TZDate(date, tz), "Pp");
};

export const getTZDate = (date: Date) => {
	return formatDate(date);
};

export const formatBusinessDate = (date: Date | string) => {
	const source = new Date(date);
	const calendarDate = new Date(
		source.getUTCFullYear(),
		source.getUTCMonth(),
		source.getUTCDate(),
	);

	return format(calendarDate, "PP");
};

export const toBusinessDateUTC = (date: Date): Date =>
	new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
