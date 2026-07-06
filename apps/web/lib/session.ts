import "server-only";

import { getActiveElevatedAccessGrant } from "@repo/db/queries";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { hasRoleStatement } from "@/components/features/nav/sidebar/utils";
import { auth, type Session } from "./auth";
import ROUTES from "./constants/routes";
import { db } from "./db";
import { hasPermission } from "./has-permission";
import { type PermissionType, type ResourcePermission } from "./permissions";

// Always bypasses cookie cache. Use when you need fresh session state
// hits the db
export const getSession = async () => {
	return await auth.api.getSession({
		headers: await headers(),
		query: { disableCookieCache: true, disableRefresh: true },
	});
};

// For non-critical checks. Session may be stale
export const verifySession = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect(ROUTES.SIGN_IN);

	return session;
});

// For non-critical checks. Session may be stale
export const requirePermission = <R extends keyof PermissionType>(
	session: Session,
	resource: R,
	action: NonNullable<PermissionType[R]>[number],
) => {
	if (
		!hasRoleStatement(session.user.role, {
			resource,
			action,
		} as ResourcePermission)
	) {
		notFound();
	}
};

export const requireActiveOrg = async () => {
	const session = await verifySession();
	if (!session.session.activeOrganizationId) redirect(ROUTES.DASHBOARD);
	return session as typeof session & {
		session: { activeOrganizationId: string };
	};
};

// Hits the db. Returns the active granted elevated-access record for the
// current session, or null if none exists / it has expired / it is still
// pending admin approval. Users who can approve access requests (admin,
// owner) bypass the gate entirely - otherwise they'd be stuck needing a
// grant only they (or another admin) could approve. Uses hasPermission
// (fresh db check) rather than the cookie-cached session role, since this
// is a critical/security-sensitive check.
export const requireElevatedAccess = async (session: Session) => {
	const permitted = await hasPermission({ access_request: ["approve"] });
	if (permitted.success) return true;

	const organizationId = session.session.activeOrganizationId as string;
	return getActiveElevatedAccessGrant(session.session.id, organizationId, db);
};
