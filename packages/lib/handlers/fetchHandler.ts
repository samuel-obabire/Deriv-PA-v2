import { RequestError } from "../errors";
import logger from "../logger";
import type { ErrorResponse } from "../types";

const fetchHandler = async <T>(
	url: string,
	options?: RequestInit,
): Promise<T> => {
	const controller = new AbortController();

	const timerId = setTimeout(() => {
		controller.abort();
	}, 9000);

	try {
		const res = await fetch(url, {
			...options,
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
		});

		if (!res.ok) {
			const errorData = (await res.json().catch(() => null)) as ErrorResponse;

			logger.error(errorData);

			throw new RequestError(
				res.status,
				errorData?.error?.message ?? `Request failed with status ${res.status}`,
			);
		}

		return (await res.json()) as T;
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") {
			throw new Error(
				"Request aborted because the server did not respond in time.",
			);
		}

		throw err;
	} finally {
		clearTimeout(timerId);
	}
};

export default fetchHandler;
