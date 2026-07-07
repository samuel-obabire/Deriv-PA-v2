import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import type {
	DerivPaymentAgentTransferRequest,
	DerivPaymentAgentTransferResponse,
} from "@repo/deriv";
import { HttpClientService } from "src/http/http-client.service";
import derivRestConfig from "./deriv-rest.config";

// Deriv's REST API for payment-agent transfers. Kept deliberately separate
// from deriv-org-connection.ts (the WebSocket client) so it's always clear
// whether a given call goes over the socket or over plain HTTPS.
@Injectable()
export class DerivRestClient {
	constructor(
		@Inject(derivRestConfig.KEY)
		private readonly config: ConfigType<typeof derivRestConfig>,
		private readonly httpClient: HttpClientService,
	) {}

	// Throws (via HttpClientService's fetchHandler) whenever Deriv doesn't
	// return a clean { data: { status, transaction_id } } body — including
	// Deriv's { errors: [...] } envelope, which surfaces as a non-2xx
	// response. In that case we genuinely don't know whether the transfer
	// executed, so callers must NOT infer success or failure from this
	// throwing — it means "unknown outcome", not "failed".
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
}
