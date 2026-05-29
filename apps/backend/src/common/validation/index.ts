import * as z from "zod";

export const envSchema = z.object({
	FRONTEND_URL: z.string().min(5),
	REDIS_HOST: z.string().min(2),
	REDIS_PORT: z.coerce.number().positive(),
	REDISUSER: z.string().min(2),
	REDIS_PASSWORD: z.string().min(3),
	DATABASE_URL: z.string().min(5),

	JWT_SECRET: z.string().min(10),
	JWT_TOKEN_AUDIENCE: z.string().min(5),
	JWT_TOKEN_ISSUER: z.string().min(5),
	JWT_ACCESS_TOKEN_TTL: z.string().min(2),

	TOKEN_ENCRYPTION_KEY: z.string().min(10),
});
