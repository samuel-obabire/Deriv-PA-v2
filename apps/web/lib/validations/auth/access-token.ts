import { CURRENCY } from "@repo/db/enums";
import * as z from "zod";

export const GetTokenAccessRequestSchema = z.object({
	currency: z.enum(CURRENCY),
});

export const GetTokenAccessResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		data: z.object({
			accessToken: z.string().min(3),
		}),
	}),
	z.object({
		success: z.literal(false),
		error: z.object({
			statusCode: z.number().optional(),
			message: z.string().optional(),
		}),
	}),
]);
