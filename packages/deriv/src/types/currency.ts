import { CURRENCY_CONFIG } from "../constants";

export const derivCurrencies = CURRENCY_CONFIG.map((c) => c.code);
export type DerivCurrency = (typeof derivCurrencies)[number];
