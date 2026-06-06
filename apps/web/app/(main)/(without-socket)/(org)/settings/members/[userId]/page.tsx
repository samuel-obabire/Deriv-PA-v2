import { notFound } from "next/navigation";
import { Suspense } from "react";
import UpdateMemberRoleForm from "@/components/forms/UpdateMemberRole";
import { updateMemberRole } from "@/lib/actions/organization/updateMemberRole";
import { listMembers } from "@/lib/api/members";
import { verifySession } from "@/lib/session";

type MemberProfilePageProps = {
	params: Promise<{ userId: string }>;
};

const MemberProfile = async ({
	userId,
	organizationId,
}: {
	userId: string;
	organizationId: string;
}) => {
	const { members } = await listMembers(organizationId);
	const memberRecord = members.find((m) => m.user.id === userId);

	if (!memberRecord) notFound();

	return (
		<div className="space-y-4">
			<div>
				<p className="font-medium">{memberRecord.user.name}</p>
				<p className="text-muted-foreground text-sm">
					{memberRecord.user.email}
				</p>
			</div>
			<UpdateMemberRoleForm
				memberId={memberRecord.id}
				userId={userId}
				currentRole={memberRecord.role}
				onSubmit={updateMemberRole}
			/>
		</div>
	);
};

const MemberProfilePage = async ({ params }: MemberProfilePageProps) => {
	const session = await verifySession("organization", "update");
	const { userId } = await params;
	const organizationId = session.session.activeOrganizationId as string;

	return (
		<div className="container max-w-2xl space-y-6 mt-8">
			<section className="space-y-4">
				<h2 className="title text-2xl">Member Profile</h2>
				<Suspense fallback={<div>Loading...</div>}>
					<MemberProfile userId={userId} organizationId={organizationId} />
				</Suspense>
			</section>
		</div>
	);
};

export default MemberProfilePage;
