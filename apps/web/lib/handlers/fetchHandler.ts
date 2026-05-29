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
			throw new Error(`Request failed with status ${res.status}`);
		}

		return (await res.json()) as T;
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") {
			throw new Error("Request Aborted as server did not respond on time.");
		}

		throw err;
	} finally {
		clearTimeout(timerId);
	}
};

export default fetchHandler;
