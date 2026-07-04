import * as z from "zod";

export const RequestAccessSchema = z.object({});

export const ReviewAccessRequestSchema = z.object({
	grantId: z.uuid(),
	action: z.enum(["approve", "reject"]),
});

export const RevokeAccessGrantSchema = z.object({
	grantId: z.uuid(),
});
