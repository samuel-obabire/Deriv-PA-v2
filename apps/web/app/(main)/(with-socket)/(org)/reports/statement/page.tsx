import { getOrganizationRate } from "@repo/db/queries";
import { Suspense } from "react";
import RateNotConfigured from "@/components/ui/rate-not-configured";
import StatementOptionsProvider from "@/context/StatementOptionsProvider";
import { db } from "@/lib/db";
import { requirePermission, verifySession } from "@/lib/session";
import Statement from "./Statement";
import { StatementFilter } from "./StatementFilter";

const StatementContent = async () => {
	const session = await verifySession();
	requirePermission(session, "statement", "view");

	const rate = await getOrganizationRate(
		session.session.activeOrganizationId as string,
		db,
	);

	if (!rate) return <RateNotConfigured />;

	return <Statement rate={rate} />;
};

const StatementPage = () => {
	return (
		<div className="container flex h-[calc(100dvh-4rem)] flex-col">
			<StatementOptionsProvider>
				<div className="flex shrink-0 items-center justify-between border-b px-2 py-4">
					<div>
						<h1 className="font-space text-xl font-bold tracking-tight">
							Statement
						</h1>
						<p className="text-12-medium text-muted-foreground">
							Your transaction history
						</p>
					</div>
					<StatementFilter />
				</div>

				<div className="min-h-0 flex-1 cursor-pointer overflow-x-hidden overflow-y-auto pb-4">
					<Suspense fallback={null}>
						<StatementContent />
					</Suspense>
				</div>
			</StatementOptionsProvider>
		</div>
	);
};

export default StatementPage;
