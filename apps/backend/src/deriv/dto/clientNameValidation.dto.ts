import { paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const ClientNameValidationSchema = z.object({
	data: paymentAgentTransferSchema,
	external_reference_id: z.string().min(1).optional(),
});

export class ClientNameValidationDto extends createZodDto(
	ClientNameValidationSchema,
) {}
