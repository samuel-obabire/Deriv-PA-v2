import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { RoleNames } from "../permissions";

export const listMembers = async (organizationId: string) =>
	auth.api.listMembers({
		query: {
			organizationId,
			sortBy: "createdAt",
			sortDirection: "desc",
		},
		headers: await headers(),
	});

export const addMember = async ({
	userId,
	role,
	organizationId,
}: {
	userId: string;
	role: Exclude<RoleNames, "owner">;
	organizationId: string;
}) =>
	auth.api.addMember({
		body: {
			userId,
			role: [role],
			organizationId,
		},
		headers: await headers(),
	});

export const getActiveMemberRole = async () =>
	auth.api.getActiveMemberRole({ headers: await headers() });

export type ListMembersResult = Awaited<ReturnType<typeof listMembers>>;
