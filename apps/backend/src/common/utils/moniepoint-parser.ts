export function parseMoniepointEmail(body: string) {
	// 🔹 Amount
	const amountMatch = body.match(/Debit Amount\s+([\d,]+\.\d{2})/i);

	const amount = amountMatch
		? parseFloat(amountMatch[1].replace(/,/g, ""))
		: null;

	// 🔹 Narration
	const narrationMatch = body.match(
		/Narration:\s*([\s\S]*?)(?:\n\n|If you experience|$)/i,
	);

	let narration: string | null = null;

	if (narrationMatch) {
		narration = narrationMatch[1].split("\n")[0].split("*")[0].trim();
	}

	// 🔹 CR (optional)
	const crMatch = body.match(/CR\d+/i);
	const cr = crMatch ? crMatch[0] : null;

	if (!amount || !narration) {
		throw new Error("Failed to parse transaction info");
	}

	return {
		amount,
		narration,
		cr,
	};
}
