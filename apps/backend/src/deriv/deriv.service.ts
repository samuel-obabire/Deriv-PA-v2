import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Server } from "socket.io";
import { orgTokenKey } from "./deriv.utils";
import { DerivOrgConnection } from "./deriv-org-connection";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { SubscribeBalanceDto } from "./dto/subscribeBalance.dto";
import { TransferFundsDto } from "./dto/transferFunds.dto";

const tokens: Record<string, string> = {
	"token-1": "h9OoOCwt2yFUYYO",
};

@Injectable()
export class DerivService {
	constructor(private readonly derivOrgPoolService: DerivOrgPoolService) {}

	async initializeDerivSocket({
		orgId,
		tokenId,
	}: {
		tokenId: string;
		orgId: string;
	}) {
		if (this.derivOrgPoolService.checkOrgExist(orgId, tokenId)) return;

		const token = tokens[tokenId];
		if (!token) throw new WsException("token not found");

		const orgConnection = new DerivOrgConnection({
			orgId: orgId,
			onDrop: this.derivOrgPoolService.onDrop.bind(this.derivOrgPoolService),
		});

		this.derivOrgPoolService.addToPool({
			orgConnection,
			orgId,
			tokenId,
		});

		await this.authorizeSocket(token, orgConnection);
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
				// emit to room
				server.to(orgTokenKey(orgId, tokenId)).emit("balance", data.balance);
			},
			onError: (error) => {
				server.to(orgTokenKey(orgId, tokenId)).emit("error", error.message);
				orgSocket.disconnect();
			},
		});

		return subscriptionHash;
	}
}
