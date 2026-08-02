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

export const sanitizeAmountInput = (value: string) => {
	const [integerPart = "", ...rest] = value.replace(/[^\d.]/g, "").split(".");
	return rest.length ? `${integerPart}.${rest.join("")}` : integerPart;
};

export const formatAmountInput = (value: string) => {
	const [integerPart = "", decimalPart] = value.split(".");
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return decimalPart !== undefined
		? `${formattedInteger}.${decimalPart}`
		: formattedInteger;
};
