import { createZodDto } from "nestjs-zod";

import * as z from "zod";
import { derivCurrencies } from "../types";

const TransferFundsSchema = z.object({
	paymentagent_transfer: z.literal(1),
	currency: z.enum(derivCurrencies),
	dry_run: z.union([z.literal(0), z.literal(1)]).default(1),
	transfer_to: z.string(),
	amount: z.int().positive(),
});

export class TransferFundsDto extends createZodDto(TransferFundsSchema) {}
