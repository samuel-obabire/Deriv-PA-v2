import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import ROUTES from "./constants/routes";

export const getSession = async () => {
	return await auth.api.getSession({
		headers: await headers(),
	});
};

export const verifySession = async () => {
	const session = await getSession();

	if (!session) redirect(ROUTES.SIGN_IN);

	return session;
};
