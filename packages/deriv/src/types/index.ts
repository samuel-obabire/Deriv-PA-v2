export type DerivEndpointName =
	| "authorize"
	| "balance"
	| "paymentagent_transfer"
	| "transfer_between_accounts"
	| "forget"
	| "ping";

export type DerivSubcriptionEndpoint = "balance";

export const derivCurrencies = ["USD", "USDC", "tUSDT", "eUSDT"] as const;
export type DerivCurrency = (typeof derivCurrencies)[number];

export type RequestPayload<T extends DerivEndpointName = DerivEndpointName> =
	T extends "authorize"
		? { authorize: string }
		: T extends "balance"
			? { account: "current"; balance: 1; subscribe?: 1 }
			: T extends "transfer_between_accounts"
				? {
						account_from: string;
						account_to: string;
						amount: number;
						currency: string;
					}
				: T extends "forget"
					? { forget: string }
					: T extends "paymentagent_transfer"
						? {
								paymentagent_transfer: 1;
								amount: number;
								currency: DerivCurrency;
								transfer_to: string;
								dry_run: 0 | 1;
								description?: string;
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
					};
					subscription?: {
						id: string;
					};
					msg_type: "balance";
					req_id: number;
					echo_req: {
						[k: string]: unknown;
					};
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
				: T extends "paymentagent_transfer"
					? {
							paymentagent_transfer: 1 | 2;
							client_to_full_name: string;
							client_to_loginid: string;
							msg_type: "paymentagent_transfer";
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
						: T extends "ping"
							? {
									ping: "pong";
									msg_type: "ping";
									req_id: number;
									echo_req: {
										[k: string]: unknown;
									};
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
