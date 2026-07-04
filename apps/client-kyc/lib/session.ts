import "server-only";

import { encodeCallbackUrl } from "@repo/lib/url";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import ROUTES from "./constants/routes";

export const getSession = async () => {
	return await auth.api.getSession({
		headers: await headers(),
	});
};

export const verifySession = cache(async (currentPath?: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect(
			currentPath
				? `${ROUTES.HOME}${encodeCallbackUrl(currentPath)}`
				: ROUTES.HOME,
		);
	}

	return session;
});
