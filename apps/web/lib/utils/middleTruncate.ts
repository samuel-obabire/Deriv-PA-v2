export const middleTruncate = (text: string, max = 20) => {
	if (text.length <= max) return text;

	const left = Math.ceil((max - 1) / 2);
	const right = Math.floor((max - 1) / 2);

	return `${text.slice(0, left)}…${text.slice(-right)}`;
};
