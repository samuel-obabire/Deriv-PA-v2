import { CURRENCY } from "@repo/db/enums";
import * as z from "zod";

export const CurrencyCreateSchema = z.object({
	code: z.enum(CURRENCY),
	label: z.string().min(2),
	token: z.string().min(3),
});

export const UpdateOrganizationCurrencySchema = z.object({
	code: z.enum(CURRENCY),
	token: z.string().min(3),
});

export const DeleteOrganizationCurrencySchema = z.object({
	code: z.enum(CURRENCY),
});
