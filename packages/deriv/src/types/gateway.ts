import type { DerivCurrency } from "./currency";

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
