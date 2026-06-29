import * as z from "zod";

const ServerSchema = z.object({
	DATABASE_URL: z.url(),
	BASE_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(5),
	GOOGLE_CLIENT_ID: z.string().min(5),
	GOOGLE_CLIENT_SECRET: z.string().min(5),
	NODE_ENV: z
		.enum(["production", "development", "test"])
		.default("development"),
});

export const serverEnv = ServerSchema.parse(process.env);
