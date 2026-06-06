import { Suspense } from "react";
import MembersSection from "@/components/settings/MembersSection";
import { listMembers } from "@/lib/api/members";
import { verifySession } from "@/lib/session";

const MembersManagment = async () => {
	const session = await verifySession("organization", "update");

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
		<div className="container max-w-2xl space-y-6 mt-8">
			<section className="space-y-4">
				<h2 className="title text-2xl">Members</h2>

				<MembersManagment />
			</section>
		</div>
	);
};

export default OrganizationMembersPage;
