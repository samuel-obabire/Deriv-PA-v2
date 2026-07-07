import type { DerivCurrency } from "./index";

// Deriv REST API types. Deriv is moving some endpoints off the WebSocket API
// (see ./index.ts for that protocol) onto plain HTTPS calls — this file is
// where those REST-only wire shapes live, kept separate so it's always clear
// whether a given type describes a socket call or an HTTP call to Deriv.

export type DerivRestEndpointName = "payment_agent_transfer";

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
