import { paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

// REST counterpart of deriv/dto/transferValidation.dto.ts's {data, options} —
// orgId/tokenId travel over the wire here since there's no socket connection
// (and its decoded JWT) to pull them from.
const TransferValidationRequestSchema = z.object({
	organizationId: z.string().min(1),
	tokenId: z.string().min(1),
	data: paymentAgentTransferSchema,
	options: z.object({
		ignoreDuplicatePayment: z.boolean().optional(),
	}),
});

export class TransferValidationRequestDto extends createZodDto(
	TransferValidationRequestSchema,
) {}
