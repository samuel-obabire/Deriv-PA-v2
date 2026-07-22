import { getClientKycRecordsByOrg, PAGE_LIMIT } from "@repo/db/queries";
import { Card } from "@repo/ui";
import { Suspense } from "react";
import KycRecordHistory from "@/components/features/kyc/KycRecordHistory";
import { KycRecordsFilter } from "@/components/features/kyc/KycRecordsFilter";
import KycRecordFiltersProvider from "@/context/KycRecordFiltersProvider";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const KycRecordsContent = async () => {
	const session = await verifySession();
	const organizationId = session.session.activeOrganizationId as string;

	const records = await getClientKycRecordsByOrg(organizationId, db, {
		limit: PAGE_LIMIT,
	});

	return <KycRecordHistory initialRecords={records} />;
};

const KycRecordsPage = () => (
	<div className="container max-w-2xl py-8 space-y-8">
		<KycRecordFiltersProvider>
			<header className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="title">KYC Records</h1>
					<p className="text-sm text-muted-foreground">
						View, edit, or invalidate KYC records for your organization.
					</p>
				</div>
				<KycRecordsFilter />
			</header>

			<Suspense fallback={<Card className="h-48 animate-pulse" />}>
				<KycRecordsContent />
			</Suspense>
		</KycRecordFiltersProvider>
	</div>
);

export default KycRecordsPage;
