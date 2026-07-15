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

// Withdrawal transactions have no per-transaction rate source since the
// wallet-transactions endpoint dropped the free-text notes the old Deriv
// statement call used to carry it in — only deposits get a Naira equivalent.
export function calculateNairaEquivalent(
	amount: number,
	type: "deposit" | "withdrawal",
	rate: RateForCalc,
): number | null {
	if (type !== "deposit") return null;

	const absAmount = Math.abs(amount);
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
