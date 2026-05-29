import { transferFundsBaseSchema } from "@repo/deriv";
import * as z from "zod";

export const TransferToClientSchema = transferFundsBaseSchema.extend({
	clientAccount: z
		.string()
		.min(3, { error: "Please enter a valid client account" })
		.toUpperCase()
		.trim(),
});
