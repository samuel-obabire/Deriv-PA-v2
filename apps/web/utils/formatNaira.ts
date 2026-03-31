export const formatNaira = (amount: number) =>
	new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	}).format(amount);
