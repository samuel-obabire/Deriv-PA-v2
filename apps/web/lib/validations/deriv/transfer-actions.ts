import { notesField, paymentAgentTransferSchema } from "@repo/deriv";
import * as z from "zod";

export const ValidateTransferActionSchema = z.object({
	data: paymentAgentTransferSchema,
	options: z.object({
		ignoreDuplicatePayment: z.boolean().optional(),
	}),
});

export const ScheduleTransferActionSchema = z.object({
	data: paymentAgentTransferSchema,
	options: z.object({
		idempotencyKey: z.uuid(),
		ignoreDuplicatePayment: z.boolean().optional(),
		notes: notesField.optional(),
		depositRate: z.number().int().positive(),
	}),
});
