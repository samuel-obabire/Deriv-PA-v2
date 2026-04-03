export const parseDerivEmail = (text: string) => {
	// 🔹 Amount + Currency
	const amountMatch = text.match(
		/received\s+([\d,]+(?:\.\d+)?)\s+([A-Z]{3,})/i,
	);

	// 🔹 Sender + CR (robust)
	const senderMatch = text.match(/completed by\s+(.+?),\s*(CR\d+)/i);

	if (!amountMatch || !senderMatch) {
		throw new Error("Failed to parse transaction info from email text");
	}

	const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
	const currency = amountMatch[2].toUpperCase();
	const name = senderMatch[1].trim();
	const cr = senderMatch[2];

	return {
		amount,
		currency,
		cr,
		name,
	};
};
