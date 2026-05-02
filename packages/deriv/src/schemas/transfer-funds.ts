import * as z from "zod";

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

export const twoDpNumberNumeric = z
	.number({ error: "Amount must be a number" })
	.positive("Enter a valid positive amount (max 2 decimal places)")
	.refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), {
		message: "Enter a valid positive amount (max 2 decimal places)",
	});

export const descriptionField = z
	.string()
	.trim()
	.regex(/^[0-9A-Za-z .,'-]{0,25}$/, {
		error:
			"Description must be 25 characters or fewer and contain only letters, numbers, spaces, and .,'-",
	})
	.optional();

export const transferFundsBaseSchema = z.object({
	amount: twoDpNumber,
	description: descriptionField,
});
