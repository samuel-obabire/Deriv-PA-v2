import * as z from "zod";

const ClientSchema = z.object({
	NEXT_PUBLIC_URL: z.url(),
	NEXT_PUBLIC_DERIV_APP_ID: z.string().min(1),
});

export const clientEnv = ClientSchema.parse({
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
	NEXT_PUBLIC_DERIV_APP_ID: process.env.NEXT_PUBLIC_DERIV_APP_ID,
});
