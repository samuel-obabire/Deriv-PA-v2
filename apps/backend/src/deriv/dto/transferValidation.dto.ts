import {
	derivCurrencies,
	transferFundsBaseSchema,
	twoDpNumberNumeric,
} from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const TransferValidationSchema = z.object({
	data: transferFundsBaseSchema.extend({
		amount: twoDpNumberNumeric,
		paymentagent_transfer: z.literal(1),
		currency: z.enum(derivCurrencies),
		dry_run: z.literal(1),
		transfer_to: z.string(),
	}),
	options: z.object({
		ignoreDuplicatePayment: z.boolean().optional(),
	}),
});

export class TransferValidationDto extends createZodDto(
	TransferValidationSchema,
) {}
