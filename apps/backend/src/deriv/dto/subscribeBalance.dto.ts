import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const SubscribeBalanceSchema = z.object({
	account: z.literal("current"),
	balance: z.literal(1),
	subscribe: z.literal(1),
});

export class SubscribeBalanceDto extends createZodDto(SubscribeBalanceSchema) {}
