import {
	customSessionClient,
	inferAdditionalFields,
	organizationClient,
} from "better-auth/client/plugins";
import type { Member, Organization } from "better-auth/plugins/organization";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import {
	ac,
	admin,
	auditor,
	cashier,
	member,
	owner,
	paymentSupervisor,
} from "./permissions";

export const authClient = createAuthClient({
	plugins: [
		organizationClient({
			ac,
			roles: {
				owner,
				admin,
				member,
				auditor,
				cashier,
				"payment-supervisor": paymentSupervisor,
			},
		}),
		customSessionClient<typeof auth>(),
		inferAdditionalFields<typeof auth>(),
	],
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
