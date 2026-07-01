import { getClientKycRecordById } from "@repo/db/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import KycReviewClient from "@/components/kyc/KycReviewClient";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const KycReviewContent = async ({ recordId }: { recordId: string }) => {
	const session = await verifySession();
	const organizationId = session.session.activeOrganizationId as string;

	const record = await getClientKycRecordById(recordId, db);
	if (!record || record.organizationId !== organizationId) notFound();

	return <KycReviewClient record={record} />;
};

const KycReviewPage = async ({
	params,
}: PageProps<"/kyc/review/[recordId]">) => {
	const { recordId } = await params;

	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Review Submission</h1>
				<p className="text-sm text-muted-foreground">
					Review the client&apos;s KYC details before making a decision.
				</p>
			</header>

			<Suspense
				fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}
			>
				<KycReviewContent recordId={recordId} />
			</Suspense>
		</div>
	);
};

export default KycReviewPage;
