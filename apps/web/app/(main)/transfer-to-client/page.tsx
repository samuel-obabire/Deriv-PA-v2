import TransferToClient from "@/components/funds-transfer/TransferToClient";
import { verifySession } from "@/lib/session";

const TransferToClientPage = async () => {
	await verifySession();

	return (
		<div className="container space-y-6">
			<h1 className="title text-18-medium text-center">Transfer To Client</h1>

			<TransferToClient />
		</div>
	);
};

export default TransferToClientPage;
