import * as z from "zod";

export const RequestAccessSchema = z.object({});

export const ReviewAccessRequestSchema = z.object({
	grantId: z.uuid(),
	action: z.enum(["approve", "reject"]),
	hours: z.number().positive().max(24).optional(),
});

export const RevokeAccessGrantSchema = z.object({
	grantId: z.uuid(),
});
