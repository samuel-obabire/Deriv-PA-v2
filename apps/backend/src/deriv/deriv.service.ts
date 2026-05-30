import { Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { CURRENCY } from "@repo/db/enums";
import { DerivRequestPayload, orgTokenKey } from "@repo/deriv";
import { Server } from "socket.io";
import { RedisService } from "src/iam/redis/redis.service";
import { CurrencyTokenService } from "./currency-token.service";
import { DerivOrgConnection } from "./deriv-org-connection";
import { DerivOrgPoolService } from "./deriv-org-pool.service";
import { SubscribeBalanceDto } from "./dto/subscribeBalance.dto";
import { TransferFundsDto } from "./dto/transferFunds.dto";
import { TransactionService } from "./transaction.service";

@Injectable()
export class DerivService {
	constructor(
		private readonly derivOrgPoolService: DerivOrgPoolService,
		private readonly currencyTokenService: CurrencyTokenService,
		private readonly transactionService: TransactionService,
		private readonly redisService: RedisService,
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
		userId: string,
	) {
		const orgDerivSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		const { data, options } = transferFundsDto;

		if (data.dry_run === 0) {
			const lockKey = this.transferLockKey(
				orgId,
				transferFundsDto.data.transfer_to,
			);

			const ttlSeconds = 60 * 30;

			const acquired = await this.redisService.acquireLock(
				lockKey,
				transferFundsDto.data.amount.toString(),
				ttlSeconds,
			);

			if (!acquired && !transferFundsDto.options.ignoreDuplicatePayment) {
				throw new WsException(
					"Dupliate detected! Your Organisation has sent a payment to this account within last 30 minutes",
				);
			} else if (!acquired && transferFundsDto.options.ignoreDuplicatePayment) {
				await this.redisService.setExpiry(lockKey, ttlSeconds);
			}

			const inserted = await this.transactionService.createPending({
				clientId: data.transfer_to,
				amount: data.amount.toString(),
				currency: data.currency as CURRENCY,
				organizationId: orgId,
				staffId: userId,
				idempotencyKey: options.idempotencyKey,
			});

			const result = await orgDerivSocket.send({
				name: "paymentagent_transfer",
				payload: data,
			});

			await this.transactionService.complete(
				inserted.id,
				result.client_to_full_name,
			);

			return result;
		}

		// Todo: implement reconcilliation

		return orgDerivSocket.send({
			name: "paymentagent_transfer",
			payload: data as DerivRequestPayload<"paymentagent_transfer">,
		});
	}

	private transferLockKey(orgId: string, transferTo: string) {
		return `transferLock:${orgId}:${transferTo}`;
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
