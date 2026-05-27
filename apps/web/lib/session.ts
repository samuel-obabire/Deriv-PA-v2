import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { hasRoleStatement } from "@/components/nav/sidebar/utils";
import { auth } from "./auth";
import ROUTES from "./constants/routes";
import { ResourcePermission } from "./permissions";

/**
 * 	Skips cookie-cached session data and fetches fresh session state from the database
 *  @returns Session
 */
export const getSession = async () => {
	return await auth.api.getSession({
		headers: await headers(),

		// always get fresh session
		query: { disableCookieCache: true, disableRefresh: true },
	});
};

/**
 * May return session from cookie cache
 * @returns Session
 */
export const verifySession = cache(
	async (resource?: string, action?: string) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) redirect(ROUTES.SIGN_IN);

		if (
			resource &&
			action &&
			!hasRoleStatement(session.user.role, {
				resource,
				action,
			} as ResourcePermission)
		) {
			notFound();
		}

		return session;
	},
);

export const requireActiveOrg = async () => {
	const session = await verifySession();
	if (!session.session.activeOrganizationId) redirect(ROUTES.DASHBOARD);
	return session as typeof session & {
		session: { activeOrganizationId: string };
	};
};
