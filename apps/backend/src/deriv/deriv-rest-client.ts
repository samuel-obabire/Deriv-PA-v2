import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import type {
	DerivPaymentAgentTransferRequest,
	DerivPaymentAgentTransferResponse,
	DerivPaymentAgentTransferValidationResponse,
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
}
