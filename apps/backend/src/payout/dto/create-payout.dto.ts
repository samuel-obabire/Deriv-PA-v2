import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const PayoutSchema = z.object({
	plain: z.string(),
});

export class CreatePayoutDto extends createZodDto(PayoutSchema) {}
