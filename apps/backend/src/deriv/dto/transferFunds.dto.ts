import { paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const TransferFundsSchema = z.object({
	data: paymentAgentTransferSchema,
	options: z.object({
		idempotencyKey: z.uuid(),
		ignoreDuplicatePayment: z.boolean().optional(),
	}),
});

export class TransferFundsDto extends createZodDto(TransferFundsSchema) {}
