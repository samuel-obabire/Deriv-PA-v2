type Result<T, E = Error> = [T, null] | [null, E];

export const tryCatch = async <T, E = Error>(
	fn: () => Promise<T>,
): Promise<Result<T, E>> => {
	try {
		const data = await fn();

		return [data, null];
	} catch (err: unknown) {
		return [null, err as E];
	}
};
