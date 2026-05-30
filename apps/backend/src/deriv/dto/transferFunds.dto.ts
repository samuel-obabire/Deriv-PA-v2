import {
	derivCurrencies,
	transferFundsBaseSchema,
	twoDpNumberNumeric,
} from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const TransferFundsSchema = z.object({
	data: transferFundsBaseSchema.extend({
		amount: twoDpNumberNumeric,
		paymentagent_transfer: z.literal(1),
		currency: z.enum(derivCurrencies),
		dry_run: z.union([z.literal(0), z.literal(1)]).default(1),
		transfer_to: z.string(),
	}),
	options: z.object({
		idempotencyKey: z.uuid(),
		ignoreDuplicatePayment: z.boolean().optional(),
	}),
});

export class TransferFundsDto extends createZodDto(TransferFundsSchema) {}
