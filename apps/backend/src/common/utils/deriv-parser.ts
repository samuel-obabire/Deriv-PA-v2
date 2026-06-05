const DERIV_TRANSFER_URL =
	"https://deriv-pa-server.onrender.com/api/deriv/transfer-to-client";

type Currency = string;

type PaymentAgentActionResponse = {
	clientAccount: string;
	clientName: string;
	currency: Currency;
	transactionId: number;
	paymentAgentTransfer: 1 | 2;
	amount: number;
	agentAccount: string;
	description?: string;
};

type PaymentAgentTransferRequest = {
	paymentagent_transfer: 1;
	amount: number;
	currency: string;
	description?: string;
	dry_run?: 0 | 1;
	transfer_to: string;
	loginid?: string;
};

export const resolveClientName = async (
	loginid: string,
): Promise<string | null> => {
	try {
		const transferRequest: PaymentAgentTransferRequest = {
			paymentagent_transfer: 1,
			amount: 1,
			currency: "USD",
			transfer_to: loginid,
			dry_run: 1,
		};

		const response = await fetch(DERIV_TRANSFER_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				transferRequest,
				token: process.env.TRANSFER_TOKEN,
			}),
		});

		if (!response.ok) return null;

		const result = (await response.json()) as {
			data: PaymentAgentActionResponse;
		};
		return result.data.clientName ?? null;
	} catch (error) {
		console.error(
			`[resolveClientName] Failed to resolve name for ${loginid}:`,
			error,
		);
		return null;
	}
};

export const parseDerivEmail = async (text: string) => {
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
	const cr = senderMatch[2];
	const name = (await resolveClientName(cr)) ?? senderMatch[1].trim();

	return {
		amount,
		currency,
		cr,
		name,
	};
};
