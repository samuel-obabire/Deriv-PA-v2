import { getOrganizationRate } from "@repo/db/queries";
import { Suspense } from "react";
import RateSection from "@/components/settings/RateSection";
import RateSkeleton from "@/components/skeletons/RateSkeleton";
import { db } from "@/lib/db";
import { requirePermission, verifySession } from "@/lib/session";

const SettingsPage = async () => {
	const session = await verifySession();
	requirePermission(session, "organization", "update");

	const ratePromise = getOrganizationRate(
		session.session.activeOrganizationId as string,
		db,
	);

	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Currency Rates</h1>
				<p className="text-sm text-muted-foreground">
					Configure exchange rates used to calculate client payouts.
				</p>
			</header>

			<Suspense fallback={<RateSkeleton />}>
				<RateSection ratePromise={ratePromise} />
			</Suspense>
		</div>
	);
};

export default SettingsPage;
