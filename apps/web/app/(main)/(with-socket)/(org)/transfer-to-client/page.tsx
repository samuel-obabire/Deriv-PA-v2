import { getOrganizationRate, getRecentTransfersByOrg } from "@repo/db/queries";
import { Suspense } from "react";
import TransferSection from "@/components/funds-transfer/TransferSection";
import RateNotConfigured from "@/components/ui/rate-not-configured";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const ProtectedTransferToClient = async () => {
	const session = await verifySession();
	const orgId = session.session.activeOrganizationId as string;

	const [rate, initialTransfers] = await Promise.all([
		getOrganizationRate(orgId, db),
		getRecentTransfersByOrg(orgId, db),
	]);

	if (!rate) return <RateNotConfigured />;

	return (
		<TransferSection
			rate={rate}
			orgId={orgId}
			initialTransfers={initialTransfers}
		/>
	);
};

const TransferToClientPage = () => {
	return (
		<div className="container py-6 space-y-6">
			<h1 className="title text-18-medium text-center">Transfer To Client</h1>

			<Suspense fallback={null}>
				<ProtectedTransferToClient />
			</Suspense>
		</div>
	);
};

export default TransferToClientPage;
