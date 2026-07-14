const sanitizeText = (text: string): string => text.replace(/[^a-zA-Z\s]/g, "");

// The remark sent to Deriv's payment-agent transfer API. Kept to just the
// client name + rate — staff free-text notes are captured separately and
// never forwarded to Deriv (see useTransferFlow's options.notes).
export const buildTransferDescription = (
	clientName: string,
	depositRate: number,
): string => {
	return `${sanitizeText(clientName)} RATE ${depositRate}`;
};
