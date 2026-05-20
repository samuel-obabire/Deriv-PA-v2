import { clientEnv } from "../validations/env/client";

const ROUTES = {
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
	HOME: "/",
	DASHBOARD: "/dashboard",
	PAYOUTS: "/payouts",
	RATE_SETTINGS: "/settings/rate",
	TRANSFER_CLIENT: "/transfer-to-client",
	TRANSFER_INTERNAL: "/transfer",
	STATEMENT: "/statement",
	SUMMARY: "/summary",
	SETTINGS_RATES: "/settings/rate",
	ORGANIZATION: "/organization",
	ORGANIZATION_STAFF: "/organization/staff",
	DERIV_TOKENS: "/settings/deriv-tokens",

	GET_ACCESS_TOKEN: `${clientEnv.NEXT_PUBLIC_URL}/api/token`,
};

export default ROUTES;
