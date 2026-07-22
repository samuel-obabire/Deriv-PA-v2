import { Injectable } from "@nestjs/common";
import { KYC_STATUS } from "@repo/db/enums";
import {
	getClientKycRecordByDerivNickname,
	getClientKycRecordByExternalReferenceId,
	getDerivClientNicknameByExternalReferenceId,
} from "@repo/db/queries";
import type { DuplicateTransferDetails } from "@repo/deriv";
import { DerivResponseData, orgTokenKey } from "@repo/deriv";
import { Namespace } from "socket.io";
import { AppWsException } from "src/common/exceptions/app-ws.exception";
import { CurrencyTokenService } from "src/currency/currency-token.service";
import { DatabaseService } from "src/database/database.service";
import { RedisService } from "src/iam/redis/redis.service";
import { TransactionService } from "src/transactions/transaction.service";
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
		private readonly transactionService: TransactionService,
	) {}

	// Deriv balance has moved to their REST API, so we no longer open a live
	// Deriv WS connection (and its "authorize" handshake) on connect. Left
	// commented out rather than deleted in case a WS-backed endpoint is
	// needed again — see subscribeBalance below for the REST-migration stub.
	async authorize(_args: { tokenId: string; orgId: string }) {
		// if (this.derivOrgPoolService.checkOrgExist(orgId, tokenId)) return;
		//
		// const plainToken = await this.currencyTokenService.getDecryptedOrgToken(
		// 	orgId,
		// 	tokenId,
		// );
		//
		// // Single-use per connection — resolved fresh every time we need to open
		// // a new org socket, never cached/reused across connections.
		// const socketUrl =
		// 	await this.derivOptionsRestClient.getSocketUrl(plainToken);
		//
		// this.derivOrgPoolService.addToPool({
		// 	orgId,
		// 	tokenId,
		// 	url: socketUrl,
		// });
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
			const recentTransfer =
				await this.transactionService.findMostRecentForClient(
					orgId,
					data.to_nickname,
				);

			throw new AppWsException<DuplicateTransferDetails>(
				"Duplicate detected! Your Organisation has sent a payment to this account within last 30 minutes",
				recentTransfer
					? {
							recentTransfer: {
								id: recentTransfer.id,
								amount: recentTransfer.amount,
								currency: recentTransfer.currency,
								status: recentTransfer.status,
								clientName: recentTransfer.clientName,
								clientId: recentTransfer.clientId,
								createdAt: recentTransfer.createdAt.toISOString(),
							},
						}
					: undefined,
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

		return this.resolveClientName(orgId, { derivNickname: data.to_nickname });
	}

	// Same dry-run REST call as validatePaymentAgentTransfer, minus the redis
	// duplicate-payment lock — this never sends money, it only confirms the
	// nickname is still live on Deriv's side.
	async validateClientName(
		orgId: string,
		dto: ClientNameValidationDto,
		tokenId: string,
	) {
		const { data, external_reference_id } = dto;

		const token = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		const validation =
			await this.derivRestClient.paymentAgentTransferValidation(token, data);

		if (validation.data.client_real_name !== null) {
			return { client_real_name: validation.data.client_real_name };
		}

		return external_reference_id
			? this.resolveClientName(orgId, {
					externalReferenceId: external_reference_id,
				})
			: this.resolveClientName(orgId, { derivNickname: data.to_nickname });
	}

	// Client's real name is sourced from our own KYC records now — Deriv no
	// longer resolves this for us over the socket. Callers key the lookup by
	// whichever identifier they have on hand: the Deriv nickname, or the
	// client's external_reference_id (more stable, since a nickname can change).
	async resolveClientName(
		orgId: string,
		identifier: { derivNickname: string } | { externalReferenceId: string },
	) {
		const record =
			"derivNickname" in identifier
				? await getClientKycRecordByDerivNickname(
						{
							organizationId: orgId,
							derivNickname: identifier.derivNickname,
							status: KYC_STATUS.VERIFIED,
						},
						this.databaseService.client,
					)
				: await getClientKycRecordByExternalReferenceId(
						{
							organizationId: orgId,
							externalReferenceId: identifier.externalReferenceId,
							status: KYC_STATUS.VERIFIED,
						},
						this.databaseService.client,
					);

		return { client_real_name: record?.fullName ?? null };
	}

	// The nickname registry lookup is global, not org-scoped — external_reference_id
	// is the client's own unchangeable Deriv id, populated whenever they complete
	// the Deriv-connect OAuth flow. A miss there means that client never completed
	// it, so we fall back to the org's own (VERIFIED) KYC record, keyed by the
	// same external_reference_id, in case they submitted KYC with their Deriv
	// nickname but never did the OAuth connect.
	async resolveClientNickname(orgId: string, dto: ClientNicknameLookupDto) {
		const record = await getDerivClientNicknameByExternalReferenceId(
			dto.external_reference_id,
			this.databaseService.client,
		);

		if (record) {
			return { nickname: record.nickname };
		}

		const kycRecord = await getClientKycRecordByExternalReferenceId(
			{
				organizationId: orgId,
				externalReferenceId: dto.external_reference_id,
				status: KYC_STATUS.VERIFIED,
			},
			this.databaseService.client,
		);

		return { nickname: kycRecord?.derivNickname ?? null };
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

		// Deriv's schema marks `links` as required, but the live API doesn't
		// always send it (observed omitted entirely, not just null) — treat it
		// as the last page rather than crash.
		const nextLink = response.links?.next ?? null;

		return {
			transactions,
			nextCursor: this.extractPageCursor(nextLink),
			hasMore: nextLink !== null,
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

	// Deriv balance now lives on their REST API — see authorize above. Until
	// that REST integration is wired up here, stub a 0 balance instead of
	// subscribing over a Deriv WS connection that's no longer opened. Old
	// WS-subscription code left commented out in case it's needed again.
	async subscribeBalance(
		orgId: string,
		subscribeBalanceDto: SubscribeBalanceDto,
		tokenId: string,
		server: Namespace,
	) {
		// const orgSocket = this.derivOrgPoolService.getOrganizationSocket(
		// 	orgId,
		// 	tokenId,
		// );
		//
		// return orgSocket.subscribe({
		// 	name: "balance",
		// 	payload: subscribeBalanceDto,
		// 	onData: (data) => {
		// 		server.to(orgTokenKey(orgId, tokenId)).emit("balance", data);
		// 	},
		// 	onError: (error) => {
		// 		server.to(orgTokenKey(orgId, tokenId)).emit("error", error);
		// 		orgSocket.disconnect();
		// 	},
		// });

		server.to(orgTokenKey(orgId, tokenId)).emit("balance", {
			balance: {
				balance: 0,
				currency: "",
				loginid: "",
			},
			msg_type: "balance",
			req_id: 0,
			echo_req: {
				balance: subscribeBalanceDto.balance,
				subscribe: subscribeBalanceDto.subscribe,
			},
		} satisfies DerivResponseData<"balance">);
	}

	private transferLockKey(orgId: string, transferTo: string) {
		return `transferLock:${orgId}:${transferTo}`;
	}
}
