import { getOrganizationRate } from "@repo/db/queries";
import { PercentIcon, SettingsIcon } from "lucide-react";
import { Suspense } from "react";
import TransferToClient from "@/components/funds-transfer/TransferToClient";
import EmptyState from "@/components/ui/empty-state";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const ProtectedTransferToClient = async () => {
	const session = await verifySession();

	const rate = await getOrganizationRate(
		session.session.activeOrganizationId as string,
		db,
	);

	if (!rate)
		return (
			<EmptyState
				icon={<PercentIcon className="size-6 text-muted-foreground" />}
				title="No rate configured"
				description="A currency rate hasn't been set for your organization yet."
				href={ROUTES.RATE_SETTINGS}
				linkIcon={<SettingsIcon className="size-4" />}
				linkLabel="Configure rate"
			/>
		);

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
