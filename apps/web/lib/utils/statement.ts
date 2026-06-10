import type { DerivResponseData } from "@repo/deriv";
import { mul, ROUND_HALF_UP, roundToNearest } from "@repo/utils";

export type StatementTransaction = NonNullable<
	NonNullable<DerivResponseData<"statement">["statement"]>["transactions"]
>[number];

export function extractCounterpartyCR(longcode: string): string | null {
	const matches = longcode.match(/[A-Z]{2,6}\d+/g);
	return matches?.[0] ?? null;
}

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

export function extractRateFromAgentNote(
	longcode: string | null | undefined,
): number | null {
	if (!longcode) return null;
	const match = longcode.match(/[Rr]ate[:\s=]+(\d+(?:\.\d+)?)/);
	return match ? Number(match[1]) : null;
}

type RateForCalc = {
	withdrawal: number;
	smallAmount: number;
	charge: number;
};

export function calculateNairaEquivalent(
	transaction: StatementTransaction,
	rate: RateForCalc,
	extractedRate: number | null,
): number | null {
	if (transaction.amount == null) return null;

	const absAmount = Math.abs(transaction.amount);

	if (transaction.action_type === "withdrawal") {
		if (extractedRate === null) return null;
		const price = mul(absAmount, extractedRate, ROUND_HALF_UP).toNumber();
		return absAmount < rate.smallAmount ? price + rate.charge : price;
	}

	if (transaction.action_type === "deposit") {
		const price = roundToNearest(
			mul(absAmount, rate.withdrawal, ROUND_HALF_UP),
			10,
		).toNumber();
		return absAmount < rate.smallAmount ? price - rate.charge : price;
	}

	return null;
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
