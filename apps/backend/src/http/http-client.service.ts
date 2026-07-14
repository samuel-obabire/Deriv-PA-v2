import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

export class HttpRequestError extends HttpException {
	constructor(
		readonly statusCode: number,
		message: string,
	) {
		super(message, HttpStatus.BAD_REQUEST);
		this.name = "HttpRequestError";
	}
}

const REQUEST_TIMEOUT_MS = 9000;

@Injectable()
export class HttpClientService {
	private logger = new Logger(HttpClientService.name, { timestamp: true });

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
					(errorBody?.errors?.[0]?.detail?.message ||
						errorBody?.errors?.[0]?.code) ??
						`Request failed with status ${res.status}`,
				);
			}

			return (await res.json()) as T;
		} catch (err) {
			this.logger.error(
				`HttpException ${err instanceof Error ? err.message : JSON.stringify(err)}`,
			);

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
