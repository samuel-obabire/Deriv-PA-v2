import { getClientKycRecordsPendingReview } from "@repo/db/queries";
import { Card } from "@repo/ui";
import { Suspense } from "react";
import KycPendingList from "@/components/features/kyc/KycPendingList";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const KycPendingContent = async () => {
	const session = await verifySession();
	const organizationId = session.session.activeOrganizationId as string;

	const records = await getClientKycRecordsPendingReview(organizationId, db);

	return <KycPendingList records={records} />;
};

const KycPage = () => (
	<div className="container max-w-2xl py-8 space-y-8">
		<header className="space-y-1">
			<h1 className="title">KYC Review</h1>
			<p className="text-sm text-muted-foreground">
				Review pending KYC submissions from your clients.
			</p>
		</header>

		<Suspense fallback={<Card className="h-48 animate-pulse" />}>
			<KycPendingContent />
		</Suspense>
	</div>
);

export default KycPage;
