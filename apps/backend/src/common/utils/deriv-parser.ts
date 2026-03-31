export const parseDerivEmail = (text: string) => {
	// 🔹 Amount + Currency
	const amountMatch = text.match(
		/You have received \*([\d,.]+)\s+([A-Z]{3,})\*/i,
	);

	// 🔹 Sender (name + CR together)
	const senderMatch = text.match(/\*([^*]+),\s*(CR\d+)\*/);

	if (!amountMatch || !senderMatch) {
		throw new Error("Failed to parse transaction info from email text");
	}

	return {
		amount: parseFloat(amountMatch[1].replace(/,/g, "")),
		currency: amountMatch[2].toUpperCase(),
		cr: senderMatch[2],
		name: senderMatch[1].trim(),
	};
};
