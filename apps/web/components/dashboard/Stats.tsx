"use client";

import {
	BadgeCheck,
	BanknoteArrowUp,
	Timer,
	TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ROUTES from "@/lib/constants/routes";
import { StatConfig, StatsType } from "@/lib/types/stats";
import { buildStatItems } from "@/utils/stats";
import StatCard from "./StatsCard";

type StatsProps = {
	stats: StatsType[];
};

const STAT_CONFIG: StatConfig = [
	{
		title: "Total paid out",
		type: "TOTAL",
		icon: <BanknoteArrowUp className="text-accent-foreground" />,
		badgeText: "Balance Paid Out",
		badgeClass: "bg-accent-foreground/10 text-accent-foreground",
		valueClass: "text-accent-foreground",
	},
	{
		title: "Flagged",
		type: "FLAGGED",
		icon: <TriangleAlert className="text-error" />,
		badgeText: "Requires Action",
		badgeClass: "bg-error/10 text-error",
		valueClass: "text-error",
	},
	{
		title: "Pending/Missing",
		type: "UNMATCHED",
		icon: <Timer className="text-pending" />,
		badgeText: "Awaiting Match",
		badgeClass: "bg-pending/10 text-pending",
		valueClass: "text-pending",
	},
	{
		title: "Matched",
		type: "MATCHED",
		icon: <BadgeCheck className="text-success" />,
		badgeText: "Fully Reconciled",
		badgeClass: "bg-success/10 text-success",
		valueClass: "text-success",
	},
];

const Stats = ({ stats }: StatsProps) => {
	const router = useRouter();

	const statItems = buildStatItems(stats, STAT_CONFIG);

	const handleCardClick = (type: StatsType["type"]) => {
		router.push(`${ROUTES.AUDIT}`);
	};

	return (
		<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{statItems.map((stat) => (
				<button
					type="button"
					key={stat.type}
					className="text-left"
					onClick={() => handleCardClick(stat.type)}
				>
					<StatCard {...stat} />
				</button>
			))}
		</section>
	);
};

export default Stats;
