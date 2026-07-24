import { transferFundsBaseSchema } from "@repo/deriv";
import * as z from "zod";
import { formatUSD } from "@/lib/utils/formatCurrency";

const clientAccountField = z
	.string()
	.min(3, { error: "Please enter a valid client account" })
	.toLowerCase()
	.trim();

export const createTransferToClientSchema = ({
	min,
	max,
	currency,
}: {
	min: number;
	max: number;
	currency: string;
}) =>
	transferFundsBaseSchema
		.extend({ clientAccount: clientAccountField })
		.refine((data) => Number(data.amount) >= min, {
			message: `Minimum transfer amount is ${formatUSD(min)} ${currency}`,
			path: ["amount"],
		})
		.refine((data) => Number(data.amount) <= max, {
			message: `Maximum transfer amount is ${formatUSD(max)} ${currency}`,
			path: ["amount"],
		});

export type TransferToClientSchema = ReturnType<
	typeof createTransferToClientSchema
>;
