import type { DerivCurrency } from "./currency";
import type { DerivWalletTransactionStatus } from "./statement";

// Deriv REST API types. Deriv is moving some endpoints off the WebSocket API
// (see ./ws.ts for that protocol) onto plain HTTPS calls — this file is where
// those REST-only wire shapes live, kept separate so it's always clear
// whether a given type describes a socket call or an HTTP call to Deriv.
//
// Deriv's REST responses are not consistent across endpoint families (e.g.
// the payment-agent transfer wrapper key is "metadata", but the options
// accounts/OTP wrapper key is "meta") — each endpoint's success shape is
// typed individually below rather than through one shared generic, since
// assuming a universal shape has already proven wrong once.

export type DerivRestEndpointName =
	| "payment_agent_transfer"
	| "options_accounts"
	| "options_otp"
	| "wallet_transactions";

export type DerivPaymentAgentTransferRequest = {
	to_nickname: string;
	amount: string;
	currency: DerivCurrency;
	notes: string;
	request_id: string;
};

export type DerivPaymentAgentTransferStatus =
	| "complete"
	| "pending"
	| "rejected"
	| "failed";

export type DerivPaymentAgentTransferValidationStatus = "dry_run_ok";

export type DerivRestMetadata = {
	endpoint: string;
	method: string;
	timing: number;
};

export type DerivPaymentAgentTransferResponse = {
	data: {
		status: DerivPaymentAgentTransferStatus;
		transaction_id: number;
		client_real_name: string | null;
	};
	metadata: DerivRestMetadata;
};

export type DerivPaymentAgentTransferValidationResponse = {
	data: {
		status: DerivPaymentAgentTransferValidationStatus;
		transaction_id: null;
		client_real_name: string | null;
		client_is_agent: boolean;
	};
	metadata: DerivRestMetadata;
};

export type DerivRestErrorDetail = {
	status: number;
	code: string;
	detail: {
		message: string;
	};
};

export type DerivRestErrorResponse = {
	data: Record<string, never>;
	errors: DerivRestErrorDetail[];
	metadata: DerivRestMetadata;
};

// GET /trading/v1/options/accounts
export type DerivOptionsAccount = {
	account_id: string;
	balance: number;
	currency: string;
	group: string;
	status: string;
	account_type: string;
};

// Named exactly as requested — this endpoint's wrapper key is "meta", not
// "metadata" (confirmed against the actual payload, not assumed).
export type GetAccountResponse = {
	data: DerivOptionsAccount[];
	meta: DerivRestMetadata;
};

// POST /trading/v1/options/accounts/{accountId}/otp
export type DerivRequestOtpResponse = {
	data: {
		url: string;
	};
	meta: DerivRestMetadata;
};

// Error shape for the options accounts/OTP endpoints. Not confirmed against
// a real error payload yet (only success examples were provided) — modeled
// on the "meta" convention this endpoint family already uses, rather than
// reusing DerivRestErrorResponse's "metadata" key from the transfer domain.
export type DerivOptionsRestErrorResponse = {
	data: Record<string, never>;
	errors: DerivRestErrorDetail[];
	meta: DerivRestMetadata;
};

// GET /wallet/v1/transactions/{wallet_type}
export type DerivWalletType = "main" | "p2p" | "partner" | "payment_agent";

export type DerivWalletTransactionCategory = "deposit" | "withdrawal";
export type DerivWalletTransactionChannel = "cashier" | "payment_agent";

export type DerivWalletTransactionsRequest = {
	request_id?: string;
	transaction_currency?: string;
	start_date_time?: string | number;
	end_date_time?: string | number;
	per_page?: number;
	page_cursor?: string;
};

// source_*/destination_* are populated per the channel/category matrix (e.g.
// absent for cashier deposits, since the source is the system) — modeled as
// optional rather than assuming both sides are always present.
export type DerivWalletTransactionMetadata = {
	transaction_status: DerivWalletTransactionStatus;
	transaction_gross_amount: string;
	transaction_net_amount: string;
	transaction_currency: string;
	source_client_id?: string;
	source_wallet_type?: DerivWalletType;
	destination_client_id?: string;
	destination_wallet_type?: DerivWalletType;
};

export type DerivWalletTransaction = {
	request_id: string;
	transaction_id: number;
	timestamp: string;
	category: DerivWalletTransactionCategory;
	channel: DerivWalletTransactionChannel;
	metadata: DerivWalletTransactionMetadata;
};

// Cursor-based pagination — each link is a full URL carrying `page_cursor`,
// not a bare cursor value. Follow verbatim; null when that page doesn't exist.
export type DerivWalletTransactionsLinks = {
	self: string | null;
	next: string | null;
	prev: string | null;
	first: string | null;
};

export type DerivWalletTransactionsResponse = {
	data: {
		start_date_time: string | null;
		end_date_time: string | null;
		transactions: DerivWalletTransaction[];
	};
	// Deriv's schema marks this required, but the live API has been observed
	// omitting it entirely — don't trust it as always-present.
	links?: DerivWalletTransactionsLinks;
};

// Confirmed against the documented error example — flat {status, code,
// message}, no data/metadata wrapper unlike the payment-agent-transfer and
// options-accounts error shapes above.
export type DerivWalletTransactionsErrorResponse = {
	errors: {
		status: number;
		code: string;
		message: string;
	}[];
};
