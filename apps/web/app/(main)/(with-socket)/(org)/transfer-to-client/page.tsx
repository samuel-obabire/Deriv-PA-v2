import { getOrganizationRate } from "@repo/db/queries";
import { Suspense } from "react";
import TransferToClient from "@/components/funds-transfer/TransferToClient";
import RateNotConfigured from "@/components/ui/rate-not-configured";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const ProtectedTransferToClient = async () => {
	const session = await verifySession();

	const rate = await getOrganizationRate(
		session.session.activeOrganizationId as string,
		db,
	);

	if (!rate) return <RateNotConfigured />;

	return <TransferToClient rate={rate} />;
};

const TransferToClientPage = () => {
	return (
		<div className="container space-y-6">
			<h1 className="title text-18-medium text-center">Transfer To Client</h1>

			<Suspense fallback={null}>
				<ProtectedTransferToClient />
			</Suspense>
		</div>
	);
};

export default TransferToClientPage;
