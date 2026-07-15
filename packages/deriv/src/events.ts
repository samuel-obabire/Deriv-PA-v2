export enum DerivSocketEvent {
	Authorize = "authorize",
	TransferFunds = "paymentagent_transfer",
	ValidatePaymentAgentTransfer = "validate-payment-agent-transfer",
	ValidateClientName = "validate-client_name",
	ResolveClientNickname = "resolve-client-nickname",
	Balance = "balance",
	Statement = "statement",
}
