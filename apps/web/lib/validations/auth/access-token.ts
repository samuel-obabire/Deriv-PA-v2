import * as z from "zod";

export const GetTokenAccessRequestSchema = z.object({
	options: z
		.object({
			fresh: z.boolean().optional(),
		})
		.optional(),
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
