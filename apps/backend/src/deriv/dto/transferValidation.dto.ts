import { paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const TransferValidationSchema = z.object({
	data: paymentAgentTransferSchema,
	options: z.object({
		ignoreDuplicatePayment: z.boolean().optional(),
	}),
});

export class TransferValidationDto extends createZodDto(
	TransferValidationSchema,
) {}
