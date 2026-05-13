import { Suspense } from "react";
import TransferToClient from "@/components/funds-transfer/TransferToClient";
import { verifySession } from "@/lib/session";

const ProtectedTransferToClient = async () => {
	await verifySession();

	return <TransferToClient />;
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
