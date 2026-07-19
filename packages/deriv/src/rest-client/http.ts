// Framework-agnostic port of the backend's HttpClientService

export class DerivRestError extends Error {
	constructor(
		readonly statusCode: number,
		message: string,
	) {
		super(message);
		this.name = "DerivRestError";
	}
}

export type DerivRestConfig = {
	baseUrl: string;
	appId: string;
	timeoutMs: number;
};

export async function derivRestRequest<T>(
	config: DerivRestConfig,
	path: string,
	options?: RequestInit,
): Promise<T> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), config.timeoutMs);

	try {
		const res = await fetch(`${config.baseUrl}${path}`, {
			...options,
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				"Deriv-App-ID": config.appId,
				...options?.headers,
			},
		});

		if (!res.ok) {
			const errorBody = await res.json().catch(() => null);

			throw new DerivRestError(
				res.status,
				(errorBody?.errors?.[0]?.detail?.message ||
					errorBody?.errors?.[0]?.message ||
					errorBody?.errors?.[0]?.code) ??
					`Request failed with status ${res.status}`,
			);
		}

		return (await res.json()) as T;
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") {
			throw new Error("Request aborted because Deriv did not respond in time.");
		}

		throw err;
	} finally {
		clearTimeout(timer);
	}
}
