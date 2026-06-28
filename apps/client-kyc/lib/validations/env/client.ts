import * as z from "zod";

const ClientSchema = z.object({
	NEXT_PUBLIC_URL: z.url(),
	NEXT_PUBLIC_SERVER_URL: z.url(),
});

export const clientEnv = ClientSchema.parse({
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
	NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
});
