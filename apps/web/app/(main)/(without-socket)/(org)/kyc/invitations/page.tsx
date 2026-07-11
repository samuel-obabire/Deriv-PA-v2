import { Card } from "@repo/ui";
import { Suspense } from "react";
import KycInvitationSection from "@/components/features/settings/KycInvitationSection";
import { verifySession } from "@/lib/session";

const KycInvitationContent = async () => {
	await verifySession();

	return <KycInvitationSection />;
};

const KycInvitationsPage = () => {
	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">KYC Invitations</h1>
				<p className="text-sm text-muted-foreground">
					Generate a link for a client to complete their KYC verification. The
					link expires 1 hour after creation.
				</p>
			</header>

			<Suspense fallback={<Card className="h-48 animate-pulse" />}>
				<KycInvitationContent />
			</Suspense>
		</div>
	);
};

export default KycInvitationsPage;
