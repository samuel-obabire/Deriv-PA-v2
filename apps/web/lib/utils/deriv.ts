import { Currency } from "@repo/db";
import { CURRENCY } from "@repo/db/enums";
import { CURRENCY_CONFIG } from "@repo/deriv";

export function buildConfiguredCurrencies(
	userCurrencies: Omit<Currency, "token">[],
) {
	const currencyMap = new Map(userCurrencies.map((c) => [c.code, c]));

	return CURRENCY_CONFIG.map((currency) => {
		const existing = currencyMap.get(currency.code as CURRENCY);
		return {
			code: currency.code as CURRENCY,
			label: currency.label,
			configured: !!existing,
			data: existing ? { ...existing, code: existing.code as CURRENCY } : null,
		};
	});
}
