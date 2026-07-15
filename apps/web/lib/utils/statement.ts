import type { DerivWalletTransaction } from "@repo/deriv";
import { mul, ROUND_HALF_UP, roundToNearest } from "@repo/utils";

export type StatementTransaction = DerivWalletTransaction;

export function adjustUKDateInText(text: string): string {
	return text.replace(
		/(\d{1,2} \w{3} \d{4} \d{2}:\d{2}:\d{2}) GMT/g,
		(_, dateStr) => {
			const d = new Date(`${dateStr} UTC`);
			d.setTime(d.getTime() + 60 * 60 * 1000);
			return d
				.toUTCString()
				.replace(/^[A-Za-z]+,\s/, "")
				.replace(" GMT", " WAT");
		},
	);
}

type RateForCalc = {
	withdrawal: number;
	smallAmount: number;
	charge: number;
};

// withdrawalRate is the per-transaction rate captured at transfer time
// (transactions.depositRate in our own DB) — the statement page has no such
// source per transaction (Deriv's wallet-transactions endpoint carries no
// rate), so it never passes one and withdrawals there stay null.
export function calculateNairaEquivalent(
	amount: number,
	type: "deposit" | "withdrawal",
	rate: RateForCalc,
	withdrawalRate?: number | null,
): number | null {
	const absAmount = Math.abs(amount);

	if (type === "withdrawal") {
		if (!withdrawalRate) return null;

		const price = roundToNearest(
			mul(absAmount, withdrawalRate, ROUND_HALF_UP),
			25,
		).toNumber();

		return absAmount < rate.smallAmount ? price + rate.charge : price;
	}

	const price = roundToNearest(
		mul(absAmount, rate.withdrawal, ROUND_HALF_UP),
		5,
	).toNumber();

	return absAmount < rate.smallAmount ? price - rate.charge : price;
}

export function formatAmount(amount: number, currency: string): string {
	return `${new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount)} ${currency}`;
}

export function formatNairaValue(value: number): string {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 2,
	}).format(value);
}
