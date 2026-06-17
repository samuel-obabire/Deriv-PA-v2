import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

export const formatDate = (date: Date) => {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return format(new TZDate(date, tz), "Pp");
};

export const getTZDate = (date: Date) => {
	return formatDate(date);
};
