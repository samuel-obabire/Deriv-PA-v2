import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CurrencyTokenService } from "src/currency/currency-token.service";
import { DerivService } from "src/deriv/deriv.service";
import { DerivRestClient } from "src/deriv/deriv-rest-client";
import { HttpRequestError } from "src/http/http-client.service";
import { TransactionService } from "src/transactions/transaction.service";
import { RECONCILE_TRANSFER, TRANSFER_RECONCILIATION } from "./constants";
import type { TransferJobData } from "./transfer.processor";

// Deriv's own code string for "no transfer matches this request_id" — the
// HttpClientService folds errors[0].code into HttpRequestError.message
// whenever the error body carries no detail.message/message field, which is
// the shape this endpoint's error responses use.
const REQUEST_ID_NOT_FOUND = "RequestIDNotFound";

// A RequestIDNotFound on the first few checks likely just means Deriv hasn't
// propagated the transfer into their lookup system yet. Only past this many
// attempts do we treat it as proof the transfer never happened.
const REQUEST_ID_NOT_FOUND_FAIL_THRESHOLD = 8;

@Processor(TRANSFER_RECONCILIATION, { concurrency: 1 })
export class TransferReconciliationProcessor extends WorkerHost {
	private readonly logger = new Logger(TransferReconciliationProcessor.name);

	constructor(
		private readonly currencyTokenService: CurrencyTokenService,
		private readonly derivRestClient: DerivRestClient,
		private readonly derivService: DerivService,
		private readonly transactionService: TransactionService,
	) {
		super();
	}

	async process(job: Job<TransferJobData, unknown, typeof RECONCILE_TRANSFER>) {
		const { orgId, tokenId, transactionId, transferPayload } = job.data;
		const attemptNumber = job.attemptsMade + 1;

		const token = await this.currencyTokenService.getDecryptedOrgToken(
			orgId,
			tokenId,
		);

		let result: Awaited<
			ReturnType<typeof this.derivRestClient.paymentAgentTransferStatus>
		>;

		try {
			result = await this.derivRestClient.paymentAgentTransferStatus(
				token,
				transferPayload.request_id,
			);
		} catch (error) {
			if (
				error instanceof HttpRequestError &&
				error.message === REQUEST_ID_NOT_FOUND
			) {
				if (attemptNumber >= REQUEST_ID_NOT_FOUND_FAIL_THRESHOLD) {
					this.logger.error(
						`Deriv has no record of tx ${transactionId} (request_id ${transferPayload.request_id}) after ${attemptNumber} reconciliation attempts — marking failed`,
					);
					await this.transactionService.fail(transactionId);
					return;
				}

				this.logger.warn(
					`Deriv has no record yet of tx ${transactionId} (attempt ${attemptNumber}/${REQUEST_ID_NOT_FOUND_FAIL_THRESHOLD}) — retrying`,
				);
				throw error;
			}

			// Network failure, timeout, or a 5xx from Deriv's infrastructure —
			// outcome is still unknown. Let it retry via the queue's backoff.
			this.logger.error(
				`Reconciliation check failed for tx ${transactionId} (attempt ${attemptNumber}) — outcome still unknown`,
				error,
			);
			throw error;
		}

		const { status, transaction_id: refId } = result.data;

		if (status === "pending" || status === "requested") {
			this.logger.warn(
				`Transfer for tx ${transactionId} still ${status} on Deriv's side (attempt ${attemptNumber}) — retrying`,
			);
			throw new Error(`Transfer for tx ${transactionId} still ${status}`);
		}

		if (status === "failed" || status === "rejected") {
			try {
				await this.transactionService.fail(transactionId, refId ?? undefined);
			} catch (error) {
				this.logger.error(
					`CRITICAL: Deriv transfer failed but the failure write did not persist for tx ${transactionId} — manual reconciliation required`,
					error,
				);
				throw error;
			}
			return result;
		}

		const { client_real_name } = await this.derivService.resolveClientName(
			orgId,
			{ derivNickname: transferPayload.to_nickname },
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
			`Job ${job.id} active — tx: ${job.data.transactionId} | org: ${job.data.orgId} | attempt: ${job.attemptsMade + 1}`,
		);
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job<TransferJobData>) {
		this.logger.log(`Job ${job.id} completed — tx: ${job.data.transactionId}`);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job<TransferJobData>, error: Error) {
		const exhausted = job.attemptsMade >= (job.opts.attempts ?? 1);
		if (exhausted) {
			this.logger.error(
				`CRITICAL: Job ${job.id} exhausted all reconciliation attempts — tx: ${job.data.transactionId} | manual reconciliation required | reason: ${error.message}`,
			);
			return;
		}

		this.logger.warn(
			`Job ${job.id} failed — tx: ${job.data.transactionId} | attempt: ${job.attemptsMade} | reason: ${error.message}`,
		);
	}

	@OnWorkerEvent("error")
	onError(error: Error) {
		this.logger.error(`Worker error — ${error.message}`, error.stack);
	}
}
