import { Suspense } from "react";
import Stats from "@/components/dashboard/Stats";
import StatsSkeleton from "@/components/skeletons/StatsSkeleton";
import { verifySession } from "@/lib/session";
import { StatsType } from "@/lib/types/stats";

const stats: StatsType[] = [
	{
		type: "MATCHED",
		value: 20,
	},
	{
		type: "UNMATCHED",
		value: 14,
	},
	{
		type: "FLAGGED",
		value: 16,
	},
	{
		type: "TOTAL",
		value: "₦12,840,500",
	},
];

const DashboardStats = async () => {
	await verifySession();

	await new Promise((resolve) => setTimeout(resolve, 5000));

	return <Stats stats={stats} />;
};

const DashBoardPage = () => {
	return (
		<div className="container space-y-6 mt-28 mb-10">
			<header>
				<h2 className="font-space text-4xl font-bold tracking-tight">
					Reconciliation Monitor
				</h2>
				<p className="mt-1 text-lg text-primary font-medium tracking-wide">
					The Sovereign Ledger | Terminal View
				</p>
			</header>

			<Suspense fallback={<StatsSkeleton />}>
				<DashboardStats />
			</Suspense>
		</div>
	);
};

export default DashBoardPage;
