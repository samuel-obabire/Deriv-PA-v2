import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const WithdrawalSchema = z.object({
	body: z.object({
		text: z.object({
			body: z.string(),
		}),
	}),
});

export class CreateWithdrawalRequestDto extends createZodDto(
	WithdrawalSchema,
) {}
