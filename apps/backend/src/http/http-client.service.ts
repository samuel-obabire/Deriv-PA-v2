import { Injectable } from "@nestjs/common";

export class HttpRequestError extends Error {
	constructor(
		readonly statusCode: number,
		message: string,
	) {
		super(message);
		this.name = "HttpRequestError";
	}
}

const REQUEST_TIMEOUT_MS = 9000;

@Injectable()
export class HttpClientService {
	async request<T>(url: string, options?: RequestInit): Promise<T> {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

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
				const errorBody = await res.json().catch(() => null);

				throw new HttpRequestError(
					res.status,
					errorBody?.error?.message ??
						`Request failed with status ${res.status}`,
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
			clearTimeout(timer);
		}
	}
}
