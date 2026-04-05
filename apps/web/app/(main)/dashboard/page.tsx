import { PAYOUT_STATUS } from "@repo/db/enums";
import { Suspense } from "react";
import Stats from "@/components/dashboard/Stats";
import StatsSkeleton from "@/components/skeletons/StatsSkeleton";
import { verifySession } from "@/lib/session";
import { StatsType } from "@/lib/types/stats";

const stats: StatsType[] = [
	{
		type: PAYOUT_STATUS.MATCHED,
		value: 20,
	},
	{
		type: PAYOUT_STATUS.UNMATCHED,
		value: 14,
	},
	{
		type: PAYOUT_STATUS.FLAGGED,
		value: 16,
	},
	{
		type: "TOTAL",
		value: "₦12,840,500",
	},
];

const DashboardStats = async () => {
	await verifySession();

	await new Promise((resolve) => setTimeout(resolve, 1000));

	return <Stats stats={stats} />;
};

const DashBoardPage = () => {
	return (
		<div className="container space-y-6 mt-12 mb-10">
			<header>
				<h2 className="title">Reconciliation Monitor</h2>
				<p className="title-subtext">The Sovereign Ledger | Terminal View</p>
			</header>

			<Suspense fallback={<StatsSkeleton />}>
				<DashboardStats />
			</Suspense>
		</div>
	);
};

export default DashBoardPage;
