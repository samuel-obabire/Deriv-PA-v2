import { registerAs } from "@nestjs/config";

export default registerAs("apiToken", () => ({
	token: process.env.WEB_API_TOKEN,
}));
