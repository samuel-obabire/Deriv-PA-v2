import type { DerivCurrency } from "./currency";
import type { DerivWalletTransaction } from "./rest";
import type { StatementActionType } from "./statement";

// Our own app's socket.io contract between the frontend and the backend
// gateway (validate-transfer / validate-client_name / paymentagent_transfer
// events). This is NOT a Deriv wire type — it's our internal protocol, which
// happens to carry most of the same fields we forward to Deriv's REST
// payment-agent transfer endpoint (see ./rest.ts) once a transfer executes.
export type PaymentAgentTransferInput = {
	to_nickname: string;
	amount: string;
	currency: DerivCurrency;
	notes: string;
	request_id: string;
};

// Response for validate-transfer / validate-client_name: the client's real
// name resolved from our own KYC records, not from Deriv.
export type ClientNameValidationResult = {
	client_real_name: string | null;
};

// Our own app's socket.io contract for the "statement" event. Not a Deriv
// wire type — the backend translates this into a call against Deriv's
// wallet-transactions REST endpoint (see ./rest.ts), so field names here are
// ours to keep stable even as Deriv's own wire format changes underneath.
export type StatementQuery = {
	action_type?: StatementActionType;
	date_from?: number;
	date_to?: number;
	limit?: number;
	cursor?: string;
};

export type StatementResult = {
	transactions: DerivWalletTransaction[];
	nextCursor: string | null;
	hasMore: boolean;
};

// Resolves a wallet transaction's source_client_id/destination_client_id
// (an external_reference_id) to the nickname that client's own Deriv-connect
// OAuth flow last reported. A miss here means that client never completed
// the connect flow — there is nothing to validate against yet.
export type ClientNicknameLookupQuery = {
	external_reference_id: string;
};

export type ClientNicknameLookupResult = {
	nickname: string | null;
};
