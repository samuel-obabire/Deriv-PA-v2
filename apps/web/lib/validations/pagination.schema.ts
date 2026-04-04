import { PayoutStatusEnum } from "@repo/db";
import * as z from "zod";

const optional = <T extends z.ZodType>(schema: T) =>
	schema.nullish().transform((val) => val ?? undefined);

export const TransactionQuerySchema = z.object({
	searchQuery: optional(z.string()),

	status: optional(z.enum(PayoutStatusEnum.enumValues)),

	from: optional(z.coerce.date()),
	to: optional(z.coerce.date()),

	limit: optional(z.coerce.number().int().positive()),

	cursorDate: optional(z.coerce.date()),
	cursorId: optional(z.string()),
});

export type TransactionQuerySchemaType = z.infer<typeof TransactionQuerySchema>;
