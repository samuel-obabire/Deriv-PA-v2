import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import type { DerivPaymentAgentTransferRequest } from "@repo/deriv";
import { Job } from "bullmq";
import { CurrencyTokenService } from "src/currency/currency-token.service";
import { DerivService } from "src/deriv/deriv.service";
import { DerivRestClient } from "src/deriv/deriv-rest-client";
import { HttpRequestError } from "src/http/http-client.service";
import { TransactionService } from "src/transactions/transaction.service";
import { EXECUTE_TRANSFER, TRANSFERS } from "./constants";

export type TransferJobData = {
	orgId: string;
	tokenId: string;
	transactionId: string;
	transferPayload: DerivPaymentAgentTransferRequest;
};

@Processor(TRANSFERS)
export class TransferProcessor extends WorkerHost {
	private readonly logger = new Logger(TransferProcessor.name);

	constructor(
		private readonly currencyTokenService: CurrencyTokenService,
		private readonly derivRestClient: DerivRestClient,
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

		const token = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		let result: Awaited<
			ReturnType<typeof this.derivRestClient.paymentAgentTransfer>
		>;

		try {
			result = await this.derivRestClient.paymentAgentTransfer(
				token,
				transferPayload,
			);
		} catch (error) {
			if (
				error instanceof HttpRequestError &&
				error.statusCode >= 400 &&
				error.statusCode <= 499
			) {
				// Deriv looked at the request and rejected it outright — the
				// transfer definitely did not go through.
				this.logger.error(
					`Deriv REST transfer request rejected for tx ${transactionId} (status ${error.statusCode})`,
					error,
				);
				try {
					await this.transactionService.fail(transactionId);
				} catch (failError) {
					this.logger.error(
						`CRITICAL: Deriv transfer failed but the failure write did not persist for tx ${transactionId} — manual reconciliation required`,
						failError,
					);
				}
				throw error;
			}

			// Unknown outcome: network failure, timeout/abort, or a 5xx from
			// Deriv's own infrastructure. We do NOT know whether the transfer
			// executed on Deriv's side — leave the tx in PROCESSING rather
			// than guessing, and flag it for manual reconciliation.
			this.logger.error(
				`CRITICAL: Deriv REST transfer request failed for tx ${transactionId} — outcome unknown, manual reconciliation required`,
				error,
			);
			throw error;
		}

		const {
			status,
			transaction_id: refId,
			client_real_name: transferRealName,
		} = result.data;

		if (status === "failed" || status === "rejected") {
			try {
				await this.transactionService.fail(transactionId, refId);
			} catch (error) {
				this.logger.error(
					`CRITICAL: Deriv transfer failed but the failure write did not persist for tx ${transactionId} — manual reconciliation required`,
					error,
				);
				throw error;
			}
			return result;
		}

		// Payment went through (or is pending on Deriv's side). If the
		// completion write fails below, do NOT mark as failed — the money
		// moved (or may still move). Leaving the tx in PROCESSING signals that
		// manual reconciliation is required.
		const { client_real_name } =
			transferRealName !== null
				? { client_real_name: transferRealName }
				: await this.derivService.resolveClientName(
						orgId,
						transferPayload.to_nickname,
					);

		try {
			await this.transactionService.complete(
				transactionId,
				client_real_name,
				refId,
			);
		} catch (error) {
			this.logger.error(
				`CRITICAL: Deriv transfer succeeded but completion write failed for tx ${transactionId} — manual reconciliation required`,
				error,
			);
			throw error;
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
