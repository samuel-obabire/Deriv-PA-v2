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
	TRANSFER_HISTORY: "/reports/transfer-history",
	SUMMARY: "/summary",
	SETTINGS_RATES: "/settings/rate",
	ORGANIZATION: "/organization",
	ORGANIZATION_MEMBERS: "/organization/members",
	ACCESS_REQUESTS: "/organization/access-requests",
	ACCESS_REQUEST_STATUS: (grantId: string) => `/api/access-requests/${grantId}`,
	DERIV_TOKENS: "/settings/deriv-tokens",
	KYC_INVITATIONS: "/kyc/invitations",
	KYC_CREATE: "/kyc/create",
	KYC: "/kyc",
	KYC_REVIEW: (recordId: string) => `/kyc/review/${recordId}`,

	GET_ACCESS_TOKEN: `${clientEnv.NEXT_PUBLIC_URL}/api/token`,
};

export default ROUTES;
