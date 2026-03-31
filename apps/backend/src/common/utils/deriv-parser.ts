export const parseDerivEmail = (text: string) => {
	// 🔹 Amount + Currency (more flexible)
	const amountMatch = text.match(
		/You have received\s*\*([\d,]+(?:\.\d+)?)\s*([A-Z]{3,})\*/i,
	);

	// 🔹 Sender + CR (more flexible spacing)
	const senderMatch = text.match(/\*([^,*]+),?\s*(CR\d+)\*/i);

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
