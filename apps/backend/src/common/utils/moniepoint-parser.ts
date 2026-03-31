export function parseMoniepointEmail(body: string) {
	// 🔹 1. Extract Debit Amount
	const amountMatch = body.match(/Debit Amount\s+([\d,]+\.\d{2})/i);
	const amount = amountMatch
		? parseFloat(amountMatch[1].replace(/,/g, ""))
		: null;

	// 🔹 2. Extract Narration block
	const narrationMatch = body.match(/Narration:\s+([\s\S]*?)\n-+/i);

	let narration: string | null = null;

	if (narrationMatch) {
		// Take first line only (before the masked part)
		const firstLine = narrationMatch[1].split("\n")[0];

		// Remove anything after "*"
		narration = firstLine.split("*")[0].trim();
	}

	// 🔹 3. Extract CR (if present)
	const crMatch = body.match(/\b(CR\d+)\b/i);
	const cr = crMatch ? crMatch[1] : null;

	if (!amount || !narration) {
		throw new Error("Failed to parse transaction info from email text");
	}

	return {
		amount,
		narration,
		cr,
	};
}
