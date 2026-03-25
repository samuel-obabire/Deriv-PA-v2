type Success<T> = readonly [T, null];
type Failure<E> = readonly [null, E];

type Result<T, E = Error> = Success<T> | Failure<E>;

export const tryCatch = async <T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> => {
	try {
		const data = await promise;

		return [data, null];
	} catch (err: unknown) {
		return [null, err as E];
	}
};
