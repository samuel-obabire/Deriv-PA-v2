import "server-only";

import { hasPermission } from "./has-permission";

export const hasKycPermission = () =>
	hasPermission({ organization: ["update"] });
