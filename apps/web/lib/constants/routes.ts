import { clientEnv } from "../validations/env/client";

const ROUTES = {
	SIGN_IN: "/sign-in",
	HOME: "/",
	DASHBOARD: "/dashboard",
	PAYOUTS: "/payouts",
	RATE_SETTINGS: "/settings/rate",
	TRANSFER_CLIENT: "/transfer-to-client",
	TRANSFER_INTERNAL: "/transfer",
	STATEMENT: "/reports/statement",
	SUMMARY: "/summary",
	SETTINGS_RATES: "/settings/rate",
	ORGANIZATION: "/organization",
	ORGANIZATION_MEMBERS: "/organization/members",
	DERIV_TOKENS: "/settings/deriv-tokens",
	KYC_INVITATIONS: "/kyc/invitations",
	KYC: "/kyc",
	KYC_REVIEW: (recordId: string) => `/kyc/review/${recordId}`,

	GET_ACCESS_TOKEN: `${clientEnv.NEXT_PUBLIC_URL}/api/token`,
};

export default ROUTES;
