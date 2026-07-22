import { getClientKycRecordById } from "@repo/db/queries";
import { Card } from "@repo/ui";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import KycRecordDetail from "@/components/features/kyc/KycRecordDetail";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const KycRecordContent = async ({ recordId }: { recordId: string }) => {
	const session = await verifySession();
	const organizationId = session.session.activeOrganizationId as string;

	const record = await getClientKycRecordById(recordId, db);
	if (!record || record.organizationId !== organizationId) notFound();

	return <KycRecordDetail record={record} />;
};

const KycRecordPage = async ({
	params,
}: PageProps<"/kyc/records/[recordId]">) => {
	const { recordId } = await params;

	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Manage KYC Record</h1>
				<p className="text-sm text-muted-foreground">
					Edit the client&apos;s details or invalidate the record.
				</p>
			</header>

			<Suspense fallback={<Card className="h-96 animate-pulse" />}>
				<KycRecordContent recordId={recordId} />
			</Suspense>
		</div>
	);
};

export default KycRecordPage;
