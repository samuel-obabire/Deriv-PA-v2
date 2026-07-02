"use client";

import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import Link from "next/link";
import { use } from "react";
import { addMember } from "@/lib/actions/organization/addMember";
import type { ListMembersResult } from "@/lib/api/members";
import ROUTES from "@/lib/constants/routes";
import AddMemberForm from "../forms/AddMember";

type MembersSectionProps = {
	membersPromise: Promise<ListMembersResult>;
};

const MembersSection = ({ membersPromise }: MembersSectionProps) => {
	const { members } = use(membersPromise);

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-2">
				{members.map(({ role, user }) => (
					<Link
						key={user.id}
						href={`${ROUTES.ORGANIZATION_MEMBERS}/${user.id}`}
					>
						<Card className="bg-muted transition-colors hover:bg-muted/80 cursor-pointer">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-base">{user.name}</CardTitle>
										<CardDescription>{user.email}</CardDescription>
									</div>
									<Badge variant="secondary">{role}</Badge>
								</div>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>

			<div className="space-y-3">
				<h2 className="font-space text-base font-semibold tracking-tight">
					Add Member
				</h2>
				<AddMemberForm onSubmit={addMember} />
			</div>
		</div>
	);
};

export default MembersSection;
