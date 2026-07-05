import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { DerivRequestPayload } from "@repo/deriv";
import { Job } from "bullmq";
import { DerivService } from "src/deriv/deriv.service";
import { DerivOrgPoolService } from "src/deriv/deriv-org-pool.service";
import { TransactionService } from "src/transactions/transaction.service";
import { EXECUTE_TRANSFER, TRANSFERS } from "./constants";

export type TransferJobData = {
	orgId: string;
	tokenId: string;
	transactionId: string;
	transferPayload: DerivRequestPayload<"paymentagent_transfer"> & {
		dry_run: 0;
	};
};

@Processor(TRANSFERS)
export class TransferProcessor extends WorkerHost {
	private readonly logger = new Logger(TransferProcessor.name);

	constructor(
		private readonly derivOrgPoolService: DerivOrgPoolService,
		private readonly derivService: DerivService,
		private readonly transactionService: TransactionService,
	) {
		super();
	}

	async process(job: Job<TransferJobData, unknown, typeof EXECUTE_TRANSFER>) {
		const { orgId, tokenId, transactionId, transferPayload } = job.data;

		// Atomically claim the transaction: WHERE id = :id AND status = 'pending'.
		// If nothing is returned the tx was already claimed, cancelled, or completed — skip.
		const claimed = await this.transactionService.processing(transactionId);

		if (!claimed) {
			this.logger.warn(
				`Job ${job.id} skipped — tx ${transactionId} was not in PENDING state`,
			);
			return;
		}

		// Ensure the org's Deriv connection is live. No-op if already connected;
		// re-establishes and re-authorizes if the connection was evicted or dropped
		// during the 30-second queue delay.
		await this.derivService.authorize({ orgId, tokenId });

		const orgDerivSocket = this.derivOrgPoolService.getOrganizationSocket(
			orgId,
			tokenId,
		);

		let result: Awaited<ReturnType<typeof orgDerivSocket.send>>;

		try {
			result = await orgDerivSocket.send({
				name: "paymentagent_transfer",
				payload: transferPayload,
			});
		} catch (error) {
			// Deriv rejected the call — payment was never sent, safe to mark failed
			await this.transactionService.fail(transactionId);
			throw error;
		}

		// Payment went through. If the completion write fails below, do NOT mark
		// as failed — the money moved. Leaving the tx in PROCESSING signals that
		// manual reconciliation is required. The idempotencyKey on the record is
		// the audit anchor.
		try {
			await this.transactionService.complete(
				transactionId,
				result.client_to_full_name,
			);
		} catch (error) {
			this.logger.error(
				`CRITICAL: Deriv transfer succeeded but completion write failed for tx ${transactionId} — manual reconciliation required`,
				error,
			);
		}

		return result;
	}

	@OnWorkerEvent("active")
	onActive(job: Job<TransferJobData>) {
		this.logger.log(
			`Job ${job.id} active — tx: ${job.data.transactionId} | org: ${job.data.orgId}`,
		);
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job<TransferJobData>) {
		this.logger.log(
			`Job ${job.id} completed — tx: ${job.data.transactionId} | duration: ${job.processedOn ? Date.now() - job.processedOn : "unknown"}ms`,
		);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job<TransferJobData>, error: Error) {
		this.logger.error(
			`Job ${job.id} failed — tx: ${job.data.transactionId} | attempt: ${job.attemptsMade} | reason: ${error.message}`,
		);
	}

	@OnWorkerEvent("error")
	onError(error: Error) {
		this.logger.error(`Worker error — ${error.message}`, error.stack);
	}
}
