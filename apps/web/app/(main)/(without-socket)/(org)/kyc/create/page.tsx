import { Card } from "@repo/ui";
import { Suspense } from "react";
import CreateKycRecordSection from "@/components/features/kyc/CreateKycRecordSection";
import { verifySession } from "@/lib/session";

const CreateKycRecordContent = async () => {
	await verifySession();

	return <CreateKycRecordSection />;
};

const CreateKycRecordPage = () => (
	<div className="container max-w-2xl py-8 space-y-8">
		<header className="space-y-1">
			<h1 className="title">Create KYC Record</h1>
			<p className="text-sm text-muted-foreground">
				Add a verified KYC record for an existing client directly, without
				sending an invitation link.
			</p>
		</header>

		<Suspense fallback={<Card className="h-48 animate-pulse" />}>
			<CreateKycRecordContent />
		</Suspense>
	</div>
);

export default CreateKycRecordPage;
