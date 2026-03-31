import { Decimal } from "decimal.js";

const decimal = (value: Decimal.Value) => new Decimal(value);

export const add = (a: Decimal.Value, b: Decimal.Value) => decimal(a).plus(b);

export const sub = (a: Decimal.Value, b: Decimal.Value) => decimal(a).minus(b);

export const mul = (a: Decimal.Value, b: Decimal.Value) => decimal(a).times(b);

export const div = (a: Decimal.Value, b: Decimal.Value) => decimal(a).div(b);
