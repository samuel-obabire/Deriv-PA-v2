import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { hasRoleStatement } from "@/components/nav/sidebar/utils";
import { auth, type Session } from "./auth";
import ROUTES from "./constants/routes";
import { type PermissionType, type ResourcePermission } from "./permissions";

// Always bypasses cookie cache. Use when you need fresh session state
export const getSession = async () => {
	return await auth.api.getSession({
		headers: await headers(),
		query: { disableCookieCache: true, disableRefresh: true },
	});
};

export const verifySession = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect(ROUTES.SIGN_IN);

	return session;
});

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
