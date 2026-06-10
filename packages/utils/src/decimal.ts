import { Decimal } from "decimal.js";

type Rounding = Decimal.Rounding;

export const ROUND_DOWN = Decimal.ROUND_DOWN as Rounding;
export const ROUND_HALF_UP = Decimal.ROUND_HALF_UP as Rounding;

const DEFAULT_ROUNDING: Rounding = ROUND_DOWN;

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

export const roundToNearest = (
	value: Decimal.Value,
	step: number,
	rounding: Rounding = ROUND_HALF_UP,
) =>
	configured(rounding)(value)
		.div(step)
		.toDecimalPlaces(0, rounding)
		.times(step);
