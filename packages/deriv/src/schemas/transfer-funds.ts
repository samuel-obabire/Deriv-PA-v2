import * as z from "zod";
import { derivCurrencies } from "../types";

export const twoDpNumber = z
	.string()
	.trim()
	.min(1, "Amount is required")
	.refine(
		(val) => {
			if (!/^\d+(\.\d{1,2})?$/.test(val)) return false;

			const num = Number(val);
			return num > 0;
		},
		{
			message: "Enter a valid positive amount (max 2 decimal places)",
		},
	);

export const descriptionField = z
	.string()
	.trim()
	.regex(/^[0-9A-Za-z .,'-]{0,200}$/, {
		error:
			"Description must be 200 characters or fewer and contain only letters, numbers, spaces, and .,'-",
	})
	.optional();

export const transferFundsBaseSchema = z.object({
	amount: twoDpNumber,
	description: descriptionField,
});

// Notes accepts the same character set as the legacy description field, but is
// always present (Deriv's payment-agent transfer contract requires the key,
// even if blank) rather than optional.
export const notesField = z
	.string()
	.trim()
	.regex(/^[0-9A-Za-z .,'-]{0,200}$/, {
		error:
			"Notes must be 200 characters or fewer and contain only letters, numbers, spaces, and .,'-",
	});

// Shape Deriv's payment-agent transfer REST endpoint expects, shared by the
// validate-transfer, validate-client-name, and real-transfer gateway DTOs.
export const paymentAgentTransferSchema = z.object({
	to_nickname: z.string().min(1, "Client account is required"),
	amount: twoDpNumber,
	currency: z.enum(derivCurrencies),
	notes: notesField,
	request_id: z.uuid(),
});
