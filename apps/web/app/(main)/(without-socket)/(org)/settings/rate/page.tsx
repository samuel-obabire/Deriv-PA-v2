import { getOrganizationRate } from "@repo/db/queries";
import { Suspense } from "react";
import RateSection from "@/components/settings/RateSection";
import RateSkeleton from "@/components/skeletons/RateSkeleton";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const SettingsPage = async () => {
	const session = await verifySession("organization", "update");

	const ratePromise = getOrganizationRate(
		session.session.activeOrganizationId as string,
		db,
	);

	return (
		<div className="container max-w-2xl  space-y-6 mt-8">
			{/* <section className="space-y-4">
				<h2 className="title text-2xl">Account</h2>

				<Suspense fallback={<AccountSkeleton />}>
					<AccountSection sessionPromise={sessionPromise} />
				</Suspense>
			</section> */}

			<section className="space-y-4">
				<h2 className="title text-2xl">Currency Rates</h2>
				<Suspense fallback={<RateSkeleton />}>
					<RateSection ratePromise={ratePromise} />
				</Suspense>
			</section>
		</div>
	);
};

export default SettingsPage;
