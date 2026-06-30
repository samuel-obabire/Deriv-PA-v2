import { Suspense } from "react";
import KycInvitationSection from "@/components/settings/KycInvitationSection";
import { requirePermission, verifySession } from "@/lib/session";

const KycInvitationContent = async () => {
	const session = await verifySession();
	requirePermission(session, "organization", "update");
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

			<Suspense
				fallback={<div className="h-48 animate-pulse rounded-xl bg-muted" />}
			>
				<KycInvitationContent />
			</Suspense>
		</div>
	);
};

export default KycInvitationsPage;
