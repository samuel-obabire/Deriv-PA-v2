export const formatNaira = (amount: number) =>
	new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	}).format(amount);

export const formatUSD = (amount: number | string) =>
	new Intl.NumberFormat("en-US", {
		style: "decimal",
		currency: "USD",
	}).format(Number(amount));
