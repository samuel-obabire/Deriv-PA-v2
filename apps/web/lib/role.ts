import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getActiveMemberRole = async () =>
	auth.api.getActiveMemberRole({ headers: await headers() });
