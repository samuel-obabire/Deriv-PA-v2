import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { hasRoleStatement } from "@/components/nav/sidebar/utils";
import { auth, SessionWithActiveOrg } from "./auth";
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
export const verifySession = async (permission?: ResourcePermission) => {
	const session = await getSession();

	if (!session) redirect(ROUTES.SIGN_IN);

	if (permission && !hasRoleStatement(session.user.role, permission)) {
		notFound();
	}

	return session as SessionWithActiveOrg;
};
