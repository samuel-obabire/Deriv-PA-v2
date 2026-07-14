import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { getClientKycRecordByDerivNickname } from "@repo/db/queries";
import { orgTokenKey } from "@repo/deriv";
import { Server } from "socket.io";
import { CurrencyTokenService } from "src/currency/currency-token.service";
import { DatabaseService } from "src/database/database.service";
import { RedisService } from "src/iam/redis/redis.service";
import { DerivOptionsRestClient } from "./deriv-options-rest-client";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { DerivRestClient } from "./deriv-rest-client";
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
		private readonly databaseService: DatabaseService,
		private readonly derivOptionsRestClient: DerivOptionsRestClient,
		private readonly derivRestClient: DerivRestClient,
	) {}

	async authorize({ orgId, tokenId }: { tokenId: string; orgId: string }) {
		if (this.derivOrgPoolService.checkOrgExist(orgId, tokenId)) return;

		const plainToken = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		// Single-use per connection — resolved fresh every time we need to open
		// a new org socket, never cached/reused across connections.
		const socketUrl =
			await this.derivOptionsRestClient.getSocketUrl(plainToken);

		this.derivOrgPoolService.addToPool({
			orgId,
			tokenId,
			url: socketUrl,
		});
	}

	async validatePaymentAgentTransfer(
		orgId: string,
		dto: TransferValidationDto,
		tokenId: string,
	) {
		const { data, options } = dto;

		const lockKey = this.transferLockKey(orgId, data.to_nickname);
		const lockExists = await this.redisService.checkLockExists(lockKey);

		if (lockExists && !options.ignoreDuplicatePayment) {
			throw new WsException(
				"Duplicate detected! Your Organisation has sent a payment to this account within last 30 minutes",
			);
		}

		const [, clientData] = await Promise.all([
			this.currencyTokenService
				.getDecryptedOrgToken(orgId, tokenId)
				.then((token) =>
					this.derivRestClient.paymentAgentTransferValidation(token, data),
				),
			this.resolveClientName(orgId, data.to_nickname),
		]);

		return clientData;
	}

	async validateClientName(orgId: string, dto: ClientNameValidationDto) {
		const { data } = dto;

		return this.resolveClientName(orgId, data.to_nickname);
	}

	// Client's real name is sourced from our own KYC records now, keyed by the
	// Deriv nickname — Deriv no longer resolves this for us over the socket.
	async resolveClientName(orgId: string, derivNickname: string) {
		const record = await getClientKycRecordByDerivNickname(
			{ organizationId: orgId, derivNickname },
			this.databaseService.client,
		);

		return { client_real_name: record?.fullName ?? null };
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
