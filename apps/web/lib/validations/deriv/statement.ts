import { derivCurrencies, STATEMENT_ACTION_TYPE } from "@repo/deriv";
import * as z from "zod";

const optional = <T extends z.ZodType>(schema: T) =>
	schema.nullish().transform((val) => val ?? undefined);

export const StatementQuerySchema = z.object({
	currency: z.enum(derivCurrencies),
	action_type: optional(z.enum(STATEMENT_ACTION_TYPE)),
	date_from: optional(z.coerce.number()),
	date_to: optional(z.coerce.number()),
	limit: optional(z.coerce.number().min(100).max(1000)),
	cursor: optional(z.string()),
});

export type StatementQuerySchemaType = z.infer<typeof StatementQuerySchema>;
