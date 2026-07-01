import { notFound } from "next/navigation";
import { Suspense } from "react";
import UpdateMemberRoleForm from "@/components/forms/UpdateMemberRole";
import { updateMemberRole } from "@/lib/actions/organization/updateMemberRole";
import { listMembers } from "@/lib/api/members";
import { requirePermission, verifySession } from "@/lib/session";

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
	const session = await verifySession();
	requirePermission(session, "organization", "update");
	const { userId } = await params;
	const organizationId = session.session.activeOrganizationId as string;

	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Member Profile</h1>
			</header>

			<Suspense
				fallback={<div className="h-32 animate-pulse rounded-xl bg-muted" />}
			>
				<MemberProfile userId={userId} organizationId={organizationId} />
			</Suspense>
		</div>
	);
};

export default MemberProfilePage;
