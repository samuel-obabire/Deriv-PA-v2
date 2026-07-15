import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import {
	getClientKycRecordByDerivNickname,
	getDerivClientNicknameByExternalReferenceId,
} from "@repo/db/queries";
import { orgTokenKey } from "@repo/deriv";
import { Server } from "socket.io";
import { CurrencyTokenService } from "src/currency/currency-token.service";
import { DatabaseService } from "src/database/database.service";
import { RedisService } from "src/iam/redis/redis.service";
import { DerivOptionsRestClient } from "./deriv-options-rest-client";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { DerivRestClient } from "./deriv-rest-client";
import { ClientNameValidationDto } from "./dto/clientNameValidation.dto";
import { ClientNicknameLookupDto } from "./dto/clientNicknameLookup.dto";
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

		const token = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);
		const validation =
			await this.derivRestClient.paymentAgentTransferValidation(token, data);

		if (validation.data.client_real_name !== null) {
			return { client_real_name: validation.data.client_real_name };
		}

		return this.resolveClientName(orgId, data.to_nickname);
	}

	// Same dry-run REST call as validatePaymentAgentTransfer, minus the redis
	// duplicate-payment lock — this never sends money, it only confirms the
	// nickname is still live on Deriv's side.
	async validateClientName(
		orgId: string,
		dto: ClientNameValidationDto,
		tokenId: string,
	) {
		const { data } = dto;

		const token = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		const validation =
			await this.derivRestClient.paymentAgentTransferValidation(token, data);

		return { client_real_name: validation.data.client_real_name };
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

	// Global, not org-scoped — external_reference_id is the client's own
	// unchangeable Deriv id, populated whenever they complete the Deriv-connect
	// OAuth flow. A miss means that client never completed it.
	async resolveClientNickname(dto: ClientNicknameLookupDto) {
		const record = await getDerivClientNicknameByExternalReferenceId(
			dto.external_reference_id,
			this.databaseService.client,
		);

		return { nickname: record?.nickname ?? null };
	}

	async getStatement(
		orgId: string,
		statementDto: StatementDto,
		tokenId: string,
	) {
		const token = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		const response = await this.derivRestClient.paymentAgentWalletTransactions(
			token,
			{
				start_date_time: statementDto.date_from,
				end_date_time: statementDto.date_to,
				per_page: statementDto.limit,
				page_cursor: statementDto.cursor,
			},
		);

		const transactions = statementDto.action_type
			? response.data.transactions.filter(
					(transaction) => transaction.category === statementDto.action_type,
				)
			: response.data.transactions;

		return {
			transactions,
			nextCursor: this.extractPageCursor(response.links.next),
			hasMore: response.links.next !== null,
		};
	}

	// Deriv's pagination links are full URLs carrying page_cursor as a query
	// param, not the bare cursor value itself.
	private extractPageCursor(link: string | null): string | null {
		if (!link) return null;

		return new URL(link, "https://placeholder.internal").searchParams.get(
			"page_cursor",
		);
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
