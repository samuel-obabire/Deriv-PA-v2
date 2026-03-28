import { PayoutStatus } from "@repo/db";
import { ReactNode } from "react";

export type StatItem = {
	title: string;
	type: StatsType["type"];
	value: string | number;
	icon: ReactNode;
	badgeText: string;
	badgeClass: string;
	valueClass: string;
};

export type StatConfig = Omit<StatItem, "value">[];

export type StatsType = {
	type: PayoutStatus | "TOTAL";
	value: number | string;
};
