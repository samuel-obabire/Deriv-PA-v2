import { CURRENCY_CONFIG } from "../constants";

export * from "./gateway";
export * from "./rest";

// Deriv WebSocket API endpoint names only. Deriv's payment-agent transfer now
// lives entirely on their REST API — see ./rest.ts — and never goes over this
// socket, so it deliberately does not appear in this union.
export type DerivEndpointName =
	| "authorize"
	| "balance"
	| "transfer_between_accounts"
	| "forget"
	| "ping"
	| "statement";

export type DerivSubcriptionEndpoint = "balance";

export const derivCurrencies = CURRENCY_CONFIG.map((c) => c.code);
export type DerivCurrency = (typeof derivCurrencies)[number];

type Statement = {
	/**
	 * Number of transactions returned in this call
	 */
	count?: number;
	/**
	 * Array of returned transactions
	 */
	transactions?: {
		/**
		 * It is the type of action.
		 */
		action_type?: StatementActionType;
		/**
		 * It is the amount of transaction.
		 */
		amount?: number;
		/**
		 * ID of the application where this contract was purchased.
		 */
		app_id?: number | null;
		/**
		 * It is the remaining balance.
		 */
		balance_after?: number;
		/**
		 * It is the contract ID.
		 */
		contract_id?: number | null;
		/**
		 * Contains details about fees used for transfer. It is present only when action type is transfer.
		 */
		fees?: {
			/**
			 * Fees amount
			 */
			amount?: number;
			/**
			 * Fees currency
			 */
			currency?: string;
			/**
			 * Minimum amount of fees
			 */
			minimum?: number;
			/**
			 * Fees percentage
			 */
			percentage?: number;
		};
		/**
		 * Contains details of account from which amount was transferred. It is present only when action type is transfer.
		 */
		from?: {
			/**
			 * Login id of the account from which money was transferred.
			 */
			loginid?: string;
		};
		/**
		 * The description of contract purchased if description is set to `1`.
		 */
		longcode?: string;
		/**
		 * Payout price
		 */
		payout?: null | number;
		/**
		 * Time at which contract was purchased, present only for sell transaction
		 */
		purchase_time?: number;
		/**
		 * Internal transaction identifier for the corresponding buy transaction ( set only for contract selling )
		 */
		reference_id?: number | null;
		/**
		 * Compact description of the contract purchased if description is set to `1`.
		 */
		shortcode?: null | string;
		/**
		 * Contains details of account to which amount was transferred. It is present only when action type is transfer.
		 */
		to?: {
			/**
			 * Login id of the account to which money was transferred.
			 */
			loginid?: string;
		};
		/**
		 * It is the transaction ID. In statement every contract (buy or sell) and every payment has a unique ID.
		 */
		transaction_id?: number;
		/**
		 * It is the time of transaction.
		 */
		transaction_time?: number;
		/**
		 * Additional withdrawal details such as typical processing times, if description is set to `1`.
		 */
		withdrawal_details?: string;
	}[];
};

export type StatementActionType = (typeof STATEMENT_ACTION_TYPE)[number];

export const STATEMENT_ACTION_TYPE = [
	"deposit",
	"withdrawal",
	"buy",
	"sell",
	"hold",
	"release",
	"adjustment",
	"virtual_credit",
	"transfer",
] as const;

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
