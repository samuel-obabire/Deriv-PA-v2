export const orgTokenKey = (orgId: string, tokenId: string) => {
	return `${orgId}:${tokenId}`;
};

export const hashPayload = <T extends object>(payload: T): string => {
	const sorted = Object.keys(payload)
		.sort()
		.reduce<Record<PropertyKey, T>>((acc, key) => {
			acc[key] = payload[key];
			return acc;
		}, {});

	return JSON.stringify(sorted);
};

export const createPromise = <T, E = Error>() => {
	let resolve: (value: T) => void;
	let reject: (reason: E) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
};
