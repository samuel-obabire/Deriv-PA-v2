import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PermissionType } from "./permissions";

export const hasPermission = async (permissions: PermissionType) => {
	return await auth.api.hasPermission({
		headers: await headers(),
		body: {
			permissions,
		},
	});
};
