const sanitizeText = (text: string): string => text.replace(/[^a-zA-Z]/g, "");

export const buildTransferDescription = (
	clientName: string,
	depositRate: number,
	userDescription?: string,
): string => {
	const ratePart = `${sanitizeText(clientName)} RATE ${depositRate}`;
	const sanitizedUserDesc = userDescription?.trim()
		? sanitizeText(userDescription.trim())
		: "";
	return sanitizedUserDesc ? `${sanitizedUserDesc} ${ratePart}` : ratePart;
};
