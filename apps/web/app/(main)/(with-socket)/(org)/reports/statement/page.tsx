import { getOrganizationRate } from "@repo/db/queries";
import { Suspense } from "react";

import RateNotConfigured from "@/components/ui/rate-not-configured";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

import Statement from "./Statement";

const StatementContent = async () => {
	const session = await verifySession();

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
			<h1 className="title text-18-medium shrink-0 py-4 text-center">
				Statement
			</h1>

			<div className="min-h-0 flex-1 cursor-pointer overflow-x-hidden overflow-y-auto pb-4">
				<Suspense fallback={null}>
					<StatementContent />
				</Suspense>
			</div>
		</div>
	);
};

export default StatementPage;
