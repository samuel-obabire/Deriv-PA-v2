import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const PayoutSchema = z.object({
	body: z.object({
		text: z.object({
			body: z.string(),
		}),
	}),
});

export class CreatePayoutDto extends createZodDto(PayoutSchema) {}
