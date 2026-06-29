import { Suspense } from "react";
import KycInvitationSection from "@/components/settings/KycInvitationSection";
import { verifySession } from "@/lib/session";

const KycInvitationContent = async () => {
	await verifySession("organization", "update");

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<KycInvitationSection />
		</Suspense>
	);
};

const KycInvitationsPage = () => {
	return (
		<div className="container max-w-2xl space-y-6 mt-8">
			<section className="space-y-4">
				<h2 className="title text-2xl">KYC Invitations</h2>
				<p className="text-sm text-muted-foreground">
					Generate a one-time link for a client to complete their KYC
					verification. The link expires 1 hour after creation.
				</p>

				<KycInvitationContent />
			</section>
		</div>
	);
};

export default KycInvitationsPage;
