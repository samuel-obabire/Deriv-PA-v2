import * as z from "zod";

const ServerSchema = z.object({
	DATABASE_URL: z.url(),
	BASE_URL: z.url(),
	BETTER_AUTH_SECRET: z.string(),
	TOKEN_ENCRYPTION_KEY: z
		.string()
		.regex(
			/^[0-9a-f]{64}$/,
			"Must be a 64-char lowercase hex string (32 bytes)",
		),
	NODE_ENV: z
		.enum(["production", "development", "test"])
		.default("development"),
});

export const serverEnv = ServerSchema.parse(process.env);
