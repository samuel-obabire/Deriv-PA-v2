import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import ROUTES from "./constants/routes";

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
export const verifySession = async () => {
	const session = await getSession();

	if (!session) redirect(ROUTES.SIGN_IN);

	return session;
};
