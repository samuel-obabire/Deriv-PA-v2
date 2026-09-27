import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";

import { Job } from "bullmq";
import { DerivService } from "src/deriv/deriv.service";

import { CUSTOMER_RECORD, ENSURE_CUSTOMER_RECORD } from "./constants";
import { CustomerRecordService } from "./customer-record.service";

export type CustomerJobData = {
	orgId: string;
	tokenId: string;

	clientName: string;
	nickname: string;
	requestId: string;
};

@Processor(CUSTOMER_RECORD)
export class CustomerRecordProcessor extends WorkerHost {
	private readonly logger = new Logger(CustomerRecordProcessor.name);

	constructor(
		private readonly derivService: DerivService,
		private readonly customerRecordService: CustomerRecordService,
	) {
		super();
	}

	async process(
		job: Job<CustomerJobData, unknown, typeof ENSURE_CUSTOMER_RECORD>,
	) {
		const { orgId, tokenId, requestId, clientName, nickname } = job.data;

		const result = await this.derivService.getStatement(orgId, {}, tokenId);

		const transfer = result.transactions.find(
			(tx) => tx.request_id === requestId,
		);

		if (transfer && transfer.metadata.transaction_status === "complete") {
			await this.customerRecordService.ensureCustomerRecord({
				clientId: transfer.metadata.destination_client_id as string,
				clientName,
				nickname,
				orgId,
			});
		}
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job<CustomerJobData>) {
		this.logger.log(
			`Job ${job.id} completed — tx: ${job.data.requestId} | duration: ${job.processedOn ? Date.now() - job.processedOn : "unknown"}ms`,
		);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job<CustomerJobData>, error: Error) {
		this.logger.error(
			`Job ${job.id} failed — tx: ${job.data.requestId} | attempt: ${job.attemptsMade} | reason: ${error.message}`,
		);
	}

	@OnWorkerEvent("error")
	onError(error: Error) {
		this.logger.error(`Worker error — ${error.message}`, error.stack);
	}
}
