import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { WsException } from "@nestjs/websockets";
import type { DerivRequestOtpResponse, GetAccountResponse } from "@repo/deriv";
import { HttpClientService } from "src/http/http-client.service";
import derivRestConfig from "./deriv-rest.config";

// Deriv's REST API for the options accounts / one-time-password prestep that
// precedes opening the real WebSocket connection.
@Injectable()
export class DerivOptionsRestClient {
	constructor(
		@Inject(derivRestConfig.KEY)
		private readonly config: ConfigType<typeof derivRestConfig>,
		private readonly httpClient: HttpClientService,
	) {}

	getAccounts(token: string) {
		return this.httpClient.request<GetAccountResponse>(
			`${this.config.baseUrl}/trading/v1/options/accounts`,
			{
				method: "GET",
				headers: {
					"Deriv-App-ID": this.config.appId,
					Authorization: `Bearer ${token}`,
				},
			},
		);
	}

	requestOtp(token: string, accountId: string) {
		return this.httpClient.request<DerivRequestOtpResponse>(
			`${this.config.baseUrl}/trading/v1/options/accounts/${accountId}/otp`,
			{
				method: "POST",
				headers: {
					"Deriv-App-ID": this.config.appId,
					Authorization: `Bearer ${token}`,
				},
			},
		);
	}

	// Resolves the one-time-use WebSocket URL for the org's real options
	// account. The OTP is single-use per connection — call this again for
	// every new socket connection rather than caching the returned url.
	async getSocketUrl(token: string): Promise<string> {
		const accountsResponse = await this.getAccounts(token);
		const realAccount = accountsResponse.data.find(
			(account) => account.account_type === "real",
		);

		if (!realAccount) {
			throw new WsException("No real Deriv options account found");
		}

		const otpResponse = await this.requestOtp(token, realAccount.account_id);

		return otpResponse.data.url;
	}
}
