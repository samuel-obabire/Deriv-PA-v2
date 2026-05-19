import { CURRENCY } from "@repo/db/enums";
import * as z from "zod";

export const GetTokenAccessRequestSchema = z.object({
	currency: z.enum(CURRENCY),
});

export const GetTokenAccessResponseSchema = z.object({
	success: z.boolean(),
	data: z
		.object({
			accessToken: z.string().min(3),
		})
		.optional(),

	error: z
		.object({
			statusCode: z.number().optional(),
			message: z.string().optional(),
		})
		.optional(),
});
