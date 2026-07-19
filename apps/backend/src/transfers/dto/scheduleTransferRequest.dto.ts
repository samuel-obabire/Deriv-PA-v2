import { notesField, paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

// REST counterpart of deriv/dto/transferFunds.dto.ts's {data, options} —
// orgId/tokenId/userId travel over the wire here since there's no socket
// connection (and its decoded JWT) to pull them from.
const ScheduleTransferRequestSchema = z.object({
	organizationId: z.string().min(1),
	tokenId: z.string().min(1),
	userId: z.string().min(1),
	data: paymentAgentTransferSchema,
	options: z.object({
		idempotencyKey: z.uuid(),
		ignoreDuplicatePayment: z.boolean().optional(),
		notes: notesField.optional(),
		depositRate: z.number().int().positive(),
	}),
});

export class ScheduleTransferRequestDto extends createZodDto(
	ScheduleTransferRequestSchema,
) {}
