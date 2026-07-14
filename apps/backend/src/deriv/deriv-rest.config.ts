import { registerAs } from "@nestjs/config";

export default registerAs("derivRest", () => ({
	baseUrl: process.env.DERIV_REST_BASE_URL,
	appId: process.env.DERIV_APP_ID,
	timeoutMs: parseInt(process.env.DERIV_REST_TIMEOUT_MS, 10),
}));
