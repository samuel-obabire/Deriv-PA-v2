import { notesField, paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const TransferFundsSchema = z.object({
	data: paymentAgentTransferSchema,
	options: z.object({
		idempotencyKey: z.uuid(),
		ignoreDuplicatePayment: z.boolean().optional(),
		// Free-text note the staff member entered in the transfer form.
		// Persisted to our own transaction record. Never forwarded to Deriv.
		notes: notesField.optional(),
		// Rate in effect when the transfer was submitted.
		depositRate: z.number().int().positive(),
	}),
});

export class TransferFundsDto extends createZodDto(TransferFundsSchema) {}
