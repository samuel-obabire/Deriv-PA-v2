import { getOrganizationRate, getRecentTransfersByOrg } from "@repo/db/queries";
import { DataRenderer } from "@repo/ui";
import { Suspense } from "react";
import RequestAccessGate from "@/components/access/RequestAccessGate";
import TransferSection from "@/components/funds-transfer/TransferSection";
import RateNotConfigured from "@/components/ui/rate-not-configured";
import { db } from "@/lib/db";
import { requireElevatedAccess, verifySession } from "@/lib/session";

const TransferGate = async ({ orgId }: { orgId: string }) => {
	const [rate, initialTransfers] = await Promise.all([
		getOrganizationRate(orgId, db),
		getRecentTransfersByOrg(orgId, db),
	]);

	return (
		<DataRenderer
			data={rate}
			empty={{ component: <RateNotConfigured /> }}
			render={(rate) => (
				<TransferSection
					rate={rate}
					orgId={orgId}
					initialTransfers={initialTransfers}
				/>
			)}
		/>
	);
};

const ProtectedTransferToClient = async () => {
	const session = await verifySession();
	const orgId = session.session.activeOrganizationId as string;
	const grant = await requireElevatedAccess(session);

	return (
		<DataRenderer
			data={grant}
			empty={{ component: <RequestAccessGate /> }}
			render={() => <TransferGate orgId={orgId} />}
		/>
	);
};

const TransferToClientPage = () => {
	return (
		<div className="container py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Transfer to Client</h1>
			</header>

			<Suspense fallback={null}>
				<ProtectedTransferToClient />
			</Suspense>
		</div>
	);
};

export default TransferToClientPage;
