import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { orgTokenKey } from "@repo/deriv";
import { Server } from "socket.io";
import { RedisService } from "src/iam/redis/redis.service";
import { CurrencyTokenService } from "./currency-token.service";
import { DerivOrgConnection } from "./deriv-org-connection";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { ClientNameValidationDto } from "./dto/clientNameValidation.dto";
import { StatementDto } from "./dto/statement.dto";
import { SubscribeBalanceDto } from "./dto/subscribeBalance.dto";
import { TransferValidationDto } from "./dto/transferValidation.dto";

@Injectable()
export class DerivService {
	constructor(
		private readonly derivOrgPoolService: DerivOrgPoolService,
		private readonly currencyTokenService: CurrencyTokenService,
		private readonly redisService: RedisService,
	) {}

	async authorize({ orgId, tokenId }: { tokenId: string; orgId: string }) {
		if (this.derivOrgPoolService.checkOrgExist(orgId, tokenId)) return;

		const plainToken = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		const orgConnection = this.derivOrgPoolService.addToPool({
			orgId,
			tokenId,
		});

		await this.authorizeSocket(plainToken, orgConnection);
	}

	async validateTransfer(
		orgId: string,
		dto: TransferValidationDto,
		tokenId: string,
	) {
		const orgDerivSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		const { data, options } = dto;

		const lockKey = this.transferLockKey(orgId, data.transfer_to);
		const lockExists = await this.redisService.checkLockExists(lockKey);

		if (lockExists && !options.ignoreDuplicatePayment) {
			throw new WsException(
				"Duplicate detected! Your Organisation has sent a payment to this account within last 30 minutes",
			);
		}

		return orgDerivSocket.send({
			name: "paymentagent_transfer",
			payload: data,
		});
	}

	async validateClientName(
		orgId: string,
		dto: ClientNameValidationDto,
		tokenId: string,
	) {
		const orgDerivSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		const { data } = dto;

		return orgDerivSocket.send({
			name: "paymentagent_transfer",
			payload: data,
		});
	}

	async getStatment(
		orgId: string,
		statementDto: StatementDto,
		tokenId: string,
	) {
		const orgDerivSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		return orgDerivSocket.send({
			name: "statement",
			payload: statementDto,
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

		return orgSocket.subscribe({
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
	}

	private transferLockKey(orgId: string, transferTo: string) {
		return `transferLock:${orgId}:${transferTo}`;
	}
}
