import { InjectQueue } from "@nestjs/bullmq";
import {
	BadRequestException,
	ConflictException,
	Injectable,
} from "@nestjs/common";
import { CURRENCY } from "@repo/db/enums";
import { Queue } from "bullmq";
import { TransferFundsDto } from "src/deriv/dto/transferFunds.dto";
import { RedisService } from "src/iam/redis/redis.service";
import { TransactionService } from "src/transactions/transaction.service";
import { EXECUTE_TRANSFER, TRANSFERS } from "./constants";
import type { TransferJobData } from "./transfer.processor";

const DEFAULT_DELAY_MS = 30_000;

@Injectable()
export class TransferQueueService {
	constructor(
		@InjectQueue(TRANSFERS) private readonly transferQueue: Queue,
		private readonly transactionService: TransactionService,
		private readonly redisService: RedisService,
	) {}

	async scheduleTransfer({
		orgId,
		tokenId,
		transferFundsDto,
		userId,
	}: {
		orgId: string;
		transferFundsDto: TransferFundsDto;
		tokenId: string;
		userId: string;
	}) {
		const { data, options } = transferFundsDto;

		const lockKey = this.transferLockKey(orgId, data.transfer_to);
		const ttlSeconds = 60 * 30;

		const acquired = await this.redisService.acquireLock(
			lockKey,
			data.amount.toString(),
			ttlSeconds,
		);

		if (!acquired && !options.ignoreDuplicatePayment) {
			throw new BadRequestException(
				"Duplicate detected! Your Organisation has sent a payment to this account within last 30 minutes",
			);
		} else if (!acquired && options.ignoreDuplicatePayment) {
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

		await this.transferQueue.add(
			EXECUTE_TRANSFER,
			{
				orgId,
				tokenId,
				transactionId: inserted.id,
				transferPayload: data,
			} satisfies TransferJobData,
			{
				delay: DEFAULT_DELAY_MS,
				jobId: inserted.id,
			},
		);

		return inserted;
	}

	async cancelTransfer(transferId: string, orgId: string) {
		const cancelled = await this.transactionService.cancelPending(
			transferId,
			orgId,
		);

		if (!cancelled) {
			const tx = await this.transactionService.findById(transferId);
			throw new ConflictException(
				tx
					? `Transfer cannot be cancelled — current status is "${tx.status}"`
					: "Transfer not found",
			);
		}

		// Best-effort job removal. If the job is already active the processor's
		// atomic PENDING guard will skip execution regardless.
		try {
			const job = await this.transferQueue.getJob(transferId);
			await job?.remove();
		} catch {
			// Job active or already gone — no action needed
		}

		return cancelled;
	}

	private transferLockKey(orgId: string, transferTo: string) {
		return `transferLock:${orgId}:${transferTo}`;
	}
}
