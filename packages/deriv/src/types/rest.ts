import type { DerivCurrency } from "./currency";

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
	| "options_otp";

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

export type DerivRestMetadata = {
	endpoint: string;
	method: string;
	timing: number;
};

export type DerivPaymentAgentTransferResponse = {
	data: {
		status: DerivPaymentAgentTransferStatus;
		transaction_id: number;
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
