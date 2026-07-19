import type {
	DerivWalletTransactionsRequest,
	DerivWalletTransactionsResponse,
} from "../types/rest";
import { type DerivRestConfig, derivRestRequest } from "./http";

export function paymentAgentWalletTransactions(
	config: DerivRestConfig,
	token: string,
	params: DerivWalletTransactionsRequest,
) {
	const query = new URLSearchParams();

	if (params.start_date_time !== undefined) {
		query.set("start_date_time", String(params.start_date_time));
	}
	if (params.end_date_time !== undefined) {
		query.set("end_date_time", String(params.end_date_time));
	}
	if (params.per_page !== undefined) {
		query.set("per_page", String(params.per_page));
	}
	if (params.page_cursor) {
		query.set("page_cursor", params.page_cursor);
	}

	return derivRestRequest<DerivWalletTransactionsResponse>(
		config,
		`/wallet/v1/transactions/payment_agent?${query.toString()}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		},
	);
}
