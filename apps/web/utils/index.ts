export const notAllNull = (obj: Record<string, unknown>): boolean => {
	return Object.values(obj).some((p) => p !== null);
};
