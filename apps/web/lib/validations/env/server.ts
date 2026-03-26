import * as z from "zod";

const ServerSchema = z.object({
	DATABASE_URL: z.url(),
	BASE_URL: z.url(),
	NODE_ENV: z.enum(["production", "development", "test"]),
});

export const serverEnv = ServerSchema.parse(process.env);
