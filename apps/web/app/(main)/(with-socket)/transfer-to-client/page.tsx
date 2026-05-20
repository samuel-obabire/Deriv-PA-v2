import { getOrganizationRate } from "@repo/db/queries";
import { Suspense } from "react";
import RateNotSet from "@/components/funds-transfer/RateNotSet";
import TransferToClient from "@/components/funds-transfer/TransferToClient";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const ProtectedTransferToClient = async () => {
	const session = await verifySession();

	const rate = await getOrganizationRate(
		session.session.activeOrganizationId as string,
		db,
	);

	if (!rate) return <RateNotSet />;

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
