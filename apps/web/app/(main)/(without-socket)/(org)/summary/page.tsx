import { getDailySummaries, PAGE_LIMIT } from "@repo/db/queries";
import { Suspense } from "react";
import { DailySummaryFilter } from "@/components/features/daily-summary/DailySummaryFilter";
import DailySummaryView from "@/components/features/daily-summary/DailySummaryView";
import DailySummaryFiltersProvider from "@/context/DailySummaryFiltersProvider";
import { db } from "@/lib/db";
import { requirePermission, verifySession } from "@/lib/session";

const DailySummaryContent = async () => {
	const session = await verifySession();
	requirePermission(session, "summary", "view");

	const organizationId = session.session.activeOrganizationId as string;

	const summaries = await getDailySummaries({
		db,
		organizationId,
		paginationOptions: { limit: PAGE_LIMIT },
	});

	return <DailySummaryView initialSummaries={summaries} />;
};

const DailySummaryPage = () => {
	return (
		<div className="container flex h-[calc(100dvh-4rem)] flex-col">
			<DailySummaryFiltersProvider>
				<div className="flex shrink-0 items-center justify-between border-b px-2 py-4">
					<div>
						<h1 className="font-space text-xl font-bold tracking-tight">
							Summary
						</h1>
						<p className="text-12-medium text-muted-foreground">
							Daily transaction totals for your organization
						</p>
					</div>
					<DailySummaryFilter />
				</div>

				<div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-4">
					<Suspense fallback={null}>
						<DailySummaryContent />
					</Suspense>
				</div>
			</DailySummaryFiltersProvider>
		</div>
	);
};

export default DailySummaryPage;
