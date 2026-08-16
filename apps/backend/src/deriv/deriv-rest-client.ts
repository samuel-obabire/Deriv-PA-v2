import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import type {
	DerivPaymentAgentTransferRequest,
	DerivPaymentAgentTransferResponse,
	DerivPaymentAgentTransferStatusResponse,
	DerivPaymentAgentTransferValidationResponse,
	DerivWalletTransactionsRequest,
	DerivWalletTransactionsResponse,
} from "@repo/deriv";
import { HttpClientService } from "src/http/http-client.service";
import derivRestConfig from "./deriv-rest.config";

// Deriv's REST API. Kept deliberately separate
// from deriv-org-connection.ts (the WebSocket client) so it's always clear
// whether a given call goes over the socket or over plain HTTPS.
@Injectable()
export class DerivRestClient {
	constructor(
		@Inject(derivRestConfig.KEY)
		private readonly config: ConfigType<typeof derivRestConfig>,
		private readonly httpClient: HttpClientService,
	) {}

	paymentAgentTransfer(
		token: string,
		payload: DerivPaymentAgentTransferRequest,
	) {
		return this.httpClient.request<DerivPaymentAgentTransferResponse>(
			`${this.config.baseUrl}/payment-agents/v1/transfer`,
			{
				method: "POST",
				headers: {
					"Deriv-App-ID": this.config.appId,
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ data: payload }),
			},
		);
	}

	// GET /payment-agents/v1/transfer/{request_id} used by reconciliation to
	// poll the outcome of a transfer whose initial POST result was unknown
	paymentAgentTransferStatus(token: string, requestId: string) {
		return this.httpClient.request<DerivPaymentAgentTransferStatusResponse>(
			`${this.config.baseUrl}/payment-agents/v1/transfer/${requestId}`,
			{
				method: "GET",
				headers: {
					"Deriv-App-ID": this.config.appId,
					Authorization: `Bearer ${token}`,
				},
			},
		);
	}

	paymentAgentTransferValidation(
		token: string,
		payload: DerivPaymentAgentTransferRequest,
	) {
		return this.httpClient.request<DerivPaymentAgentTransferValidationResponse>(
			`${this.config.baseUrl}/payment-agents/v1/transfer`,
			{
				method: "POST",
				headers: {
					"Deriv-App-ID": this.config.appId,
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ data: { ...payload, dry_run: true } }),
			},
		);
	}

	// GET /wallet/v1/transactions/payment_agent — wallet_type is hardcoded
	// since this app only ever reads the payment_agent wallet's statement,
	// unlike the generic {wallet_type} path Deriv's docs describe.
	paymentAgentWalletTransactions(
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

		return this.httpClient.request<DerivWalletTransactionsResponse>(
			`${this.config.baseUrl}/wallet/v1/transactions/payment_agent?${query.toString()}`,
			{
				method: "GET",
				headers: {
					"Deriv-App-ID": this.config.appId,
					Authorization: `Bearer ${token}`,
				},
			},
		);
	}
}
