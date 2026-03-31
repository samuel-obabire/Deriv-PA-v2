import { getCurrentRate } from "@repo/db/queries";
import { Suspense } from "react";
import AccountSection from "@/components/settings/AccountSection";
import RateSection from "@/components/settings/RateSection";
import AccountSkeleton from "@/components/skeletons/AccountSkeleton";
import RateSkeleton from "@/components/skeletons/RateSkeleton";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const SettingsPage = async () => {
	const sessionPromise = verifySession();
	const ratePromise = getCurrentRate(db);

	return (
		<div className="container max-w-2xl  space-y-6 mt-8">
			<section className="space-y-4">
				<h2 className="title text-2xl">Account</h2>

				<Suspense fallback={<AccountSkeleton />}>
					<AccountSection sessionPromise={sessionPromise} />
				</Suspense>
			</section>

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
