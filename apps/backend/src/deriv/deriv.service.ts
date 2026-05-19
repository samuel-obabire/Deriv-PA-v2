import { Injectable } from "@nestjs/common";
import { orgTokenKey } from "@repo/deriv";
import { Server } from "socket.io";
import { CurrencyTokenService } from "./currency-token.service";
import { DerivOrgConnection } from "./deriv-org-connection";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { SubscribeBalanceDto } from "./dto/subscribeBalance.dto";
import { TransferFundsDto } from "./dto/transferFunds.dto";

@Injectable()
export class DerivService {
	constructor(
		private readonly derivOrgPoolService: DerivOrgPoolService,
		private readonly currencyTokenService: CurrencyTokenService,
	) {}

	async authorize({ orgId, tokenId }: { tokenId: string; orgId: string }) {
		if (this.derivOrgPoolService.checkOrgExist(orgId, tokenId)) return;

		const plainToken = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		const orgConnection = new DerivOrgConnection({
			orgId: orgId,
			onDrop: this.derivOrgPoolService.onDrop.bind(this.derivOrgPoolService),
		});

		this.derivOrgPoolService.addToPool({
			orgConnection,
			orgId,
			tokenId,
		});

		await this.authorizeSocket(plainToken, orgConnection);
	}

	async transferFunds(
		orgId: string,
		transferFundsDto: TransferFundsDto,
		tokenId: string,
	) {
		const orgDerivSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		return await orgDerivSocket.send({
			name: "paymentagent_transfer",
			payload: transferFundsDto,
		});
	}

	async authorizeSocket(token: string, orgSocket: DerivOrgConnection) {
		return await orgSocket.send({
			name: "authorize",
			payload: { authorize: token },
		});
	}

	async subscribeBalance(
		orgId: string,
		subscribeBalanceDto: SubscribeBalanceDto,
		tokenId: string,
		server: Server,
	) {
		const orgSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		const subscriptionHash = await orgSocket.subscribe({
			name: "balance",
			payload: subscribeBalanceDto,
			onData: (data) => {
				server.to(orgTokenKey(orgId, tokenId)).emit("balance", data);
			},
			onError: (error) => {
				server.to(orgTokenKey(orgId, tokenId)).emit("error", error);
				orgSocket.disconnect();
			},
		});

		return subscriptionHash;
	}
}
