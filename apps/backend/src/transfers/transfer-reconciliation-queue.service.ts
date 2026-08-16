import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { RECONCILE_TRANSFER, TRANSFER_RECONCILIATION } from "./constants";
import type { TransferJobData } from "./transfer.processor";

const INITIAL_DELAY_MS = 5 * 60 * 1000;

@Injectable()
export class TransferReconciliationQueueService {
	constructor(
		@InjectQueue(TRANSFER_RECONCILIATION) private readonly queue: Queue,
	) {}

	async enqueueReconciliation(jobData: TransferJobData) {
		await this.queue.add(RECONCILE_TRANSFER, jobData, {
			jobId: jobData.transactionId,
			delay: INITIAL_DELAY_MS,
			attempts: 10,
			backoff: {
				type: "exponential",
				delay: INITIAL_DELAY_MS,
			},
		});
	}
}
