import { TRANSACTION_STATUS } from "@repo/db/enums";
import * as z from "zod";

const optional = <T extends z.ZodType>(schema: T) =>
	schema.nullish().transform((val) => val ?? undefined);

export const TransactionQuerySchema = z.object({
	date_from: optional(z.coerce.date()),
	date_to: optional(z.coerce.date()),

	status: optional(z.enum(TRANSACTION_STATUS)),

	amount: optional(z.coerce.number().positive()),
	clientId: optional(z.string().trim().min(1)),

	limit: optional(z.coerce.number().int().positive()),

	cursorDate: optional(z.coerce.date()),
	cursorId: optional(z.string()),
});

export type TransactionQuerySchemaType = z.infer<typeof TransactionQuerySchema>;

export const KycRecordQuerySchema = z.object({
	email: optional(z.string().trim().min(1)),
	externalReferenceId: optional(z.string().trim().min(1)),
	derivNickname: optional(z.string().trim().min(1)),
	name: optional(z.string().trim().min(1)),

	limit: optional(z.coerce.number().int().positive()),

	cursorDate: optional(z.coerce.date()),
	cursorId: optional(z.string()),
});

export type KycRecordQuerySchemaType = z.infer<typeof KycRecordQuerySchema>;
