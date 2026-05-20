import { Decimal } from "decimal.js";

type Rounding = Decimal.Rounding;

const DEFAULT_ROUNDING: Rounding = Decimal.ROUND_DOWN;

const configured = (rounding: Rounding) => Decimal.clone({ rounding });

export const add = (
	a: Decimal.Value,
	b: Decimal.Value,
	rounding: Rounding = DEFAULT_ROUNDING,
) => configured(rounding)(a).plus(b);

export const sub = (
	a: Decimal.Value,
	b: Decimal.Value,
	rounding: Rounding = DEFAULT_ROUNDING,
) => configured(rounding)(a).minus(b);

export const mul = (
	a: Decimal.Value,
	b: Decimal.Value,
	rounding: Rounding = DEFAULT_ROUNDING,
) => configured(rounding)(a).times(b);

export const div = (
	a: Decimal.Value,
	b: Decimal.Value,
	rounding: Rounding = DEFAULT_ROUNDING,
) => configured(rounding)(a).div(b);
