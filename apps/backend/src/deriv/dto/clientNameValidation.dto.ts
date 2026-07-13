import { paymentAgentTransferSchema } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const ClientNameValidationSchema = z.object({
	data: paymentAgentTransferSchema,
});

export class ClientNameValidationDto extends createZodDto(
	ClientNameValidationSchema,
) {}
