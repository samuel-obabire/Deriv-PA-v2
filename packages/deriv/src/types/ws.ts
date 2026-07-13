// Deriv WebSocket API wire types only. REST-only types live in ./rest.ts, our
// own app-internal socket.io contract lives in ./gateway.ts, and per-endpoint

import type { Statement, StatementActionType } from "./statement";

// Deriv's payment-agent transfer now lives entirely on their REST API — see
// ./rest.ts — and never goes over this socket, so it deliberately does not
// appear in this union.
export type DerivEndpointName =
	| "authorize"
	| "balance"
	| "transfer_between_accounts"
	| "forget"
	| "ping"
	| "statement";

export type DerivSubcriptionEndpoint = "balance";

export type RequestPayload<T extends DerivEndpointName = DerivEndpointName> =
	T extends "authorize"
		? { authorize: string }
		: T extends "balance"
			? { balance: 1; subscribe?: 1 }
			: T extends "transfer_between_accounts"
				? {
						account_from: string;
						account_to: string;
						amount: number;
						currency: string;
					}
				: T extends "forget"
					? { forget: string }
					: T extends "statement"
						? {
								statement: 1;
								action_type?: StatementActionType;
								date_from?: number;
								date_to?: number;
								description?: 0 | 1;
								limit?: number;
								offset?: number;
							}
						: T extends "ping"
							? { ping: 1 }
							: never;

export type DerivRequestPayload<
	T extends DerivEndpointName = DerivEndpointName,
> = RequestPayload<T>;

export type ResponseData<T extends DerivEndpointName = DerivEndpointName> =
	T extends "authorize"
		? {
				authorize: {
					loginid: string;
					email: string;
					currency: string;
					balance: number;
					fullname: string;
					scopes: string[];
				};
				msg_type: "authorize";
				req_id: number;
				echo_req: {
					[k: string]: unknown;
				};
			}
		: T extends "balance"
			? {
					balance: {
						balance: number;
						currency: string;
						loginid: string;
						// Only present on the subscription variant (subscribe: 1)
						id?: string;
					};
					// Only present on the subscription variant.
					subscription?: {
						id: string;
					};
					msg_type: "balance";
					req_id: number;
					// Known fields plus an index signature — the generic message
					// handler in deriv-org-connection.ts reads req_id/subscribe
					// off echo_req before it knows which endpoint a message
					// belongs to, across every DerivEndpointName variant.
					echo_req: {
						balance: 1;
						subscribe?: 1;
					} & Record<string, unknown>;
				}
			: T extends "transfer_between_accounts"
				? {
						transfer_between_accounts: 1;
						transaction_id: number;
						client_to_full_name: string;
						client_to_loginid: string;
						msg_type: "transfer_between_accounts";
						req_id: number;
						echo_req: {
							[k: string]: unknown;
						};
					}
				: T extends "forget"
					? {
							forget: 1;
							msg_type: "forget";
							req_id: number;
							echo_req: {
								[k: string]: unknown;
							};
						}
					: T extends "statement"
						? {
								statement?: Statement;
								msg_type: "statement";
								req_id?: number;
								echo_req: {
									[k: string]: unknown;
								};
							}
						: T extends "ping"
							? {
									ping: "pong";
									msg_type: "ping";
									req_id: number;
									echo_req: {
										ping: 1;
									} & Record<string, unknown>;
								}
							: never;

export type DerivResponseData<T extends DerivEndpointName = DerivEndpointName> =
	ResponseData<T> & {
		error?: DerivError;
	};

export type DerivError = {
	code: string;
	message: string;
};

export type RequestHandler<T extends DerivEndpointName = DerivEndpointName> = {
	onData: (data: DerivResponseData<T>) => void;
	onError: (error: unknown) => void;
};

export type SubscriptionHandler<
	T extends DerivEndpointName = DerivEndpointName,
> = {
	data?: DerivResponseData<T>;
	subscriptionName: T;
	subscriptionId?: string;
	onData: (data: DerivResponseData<T>) => void;
	onError: (error: unknown) => void;
};
