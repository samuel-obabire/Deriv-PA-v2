import { PayoutStatusEnum } from "@repo/db";
import * as z from "zod";

export const TransactionQuerySchema = z.object({
	searchQuery: z.string().nullish(),
	status: z.enum(PayoutStatusEnum.enumValues).nullish(),
	from: z.coerce.date().nullish(),
	to: z.coerce.date().nullish(),
	limit: z.coerce.number().int().positive().nullish(),
	cursorDate: z.coerce.date().nullish(),
	cursorId: z.string().nullish(),
});

export type TransactionQuerySchemaType = z.infer<typeof TransactionQuerySchema>;
