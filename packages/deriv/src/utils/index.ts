export const orgTokenKey = (orgId: string, tokenId: string) => {
	return `${orgId}:${tokenId}`;
};

export const hashPayload = <T extends Record<string, unknown>>(
	payload: T,
): string => {
	const sorted = (Object.keys(payload) as (keyof T)[])
		.sort()
		.reduce((acc, key) => {
			acc[key] = payload[key];
			return acc;
		}, {} as T);

	return JSON.stringify(sorted);
};

export const createPromise = <T, E = Error>() => {
	let resolve!: (value: T) => void;
	let reject!: (reason: E) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
};
