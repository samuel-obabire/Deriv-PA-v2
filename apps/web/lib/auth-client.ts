import { organizationClient } from "better-auth/client/plugins";
import type { Member, Organization } from "better-auth/plugins/organization";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [organizationClient()],
});

export const {
	useSession,
	useActiveOrganization,
	useListOrganizations,
	organization,
} = authClient;

// added to make typescript happy
export type { AuthQueryAtom } from "better-auth/client";

export type { Organization };
export type OrganizationWithMembers = Organization & {
	members: (Member | undefined)[];
};
