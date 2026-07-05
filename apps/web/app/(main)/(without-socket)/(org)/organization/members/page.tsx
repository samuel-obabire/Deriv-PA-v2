import { Suspense } from "react";
import MembersSection from "@/components/features/settings/MembersSection";
import { listMembers } from "@/lib/api/members";
import { requirePermission, verifySession } from "@/lib/session";

const MembersContent = async () => {
	const session = await verifySession();
	requirePermission(session, "organization", "update");
	const organizationId = session.session.activeOrganizationId as string;
	const membersPromise = listMembers(organizationId);

	return (
		<Suspense fallback={<div>Loading members...</div>}>
			<MembersSection membersPromise={membersPromise} />
		</Suspense>
	);
};

const OrganizationMembersPage = () => {
	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Members</h1>
				<p className="text-sm text-muted-foreground">
					Manage who has access to your organization.
				</p>
			</header>

			<MembersContent />
		</div>
	);
};

export default OrganizationMembersPage;
