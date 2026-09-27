import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { KYC_STATUS } from "@repo/db/enums";
import {
	createClientKycRecord,
	getClientKycRecordByExternalReferenceId,
} from "@repo/db/queries";
import { Queue } from "bullmq";
import { DatabaseService } from "src/database/database.service";
import { CUSTOMER_RECORD, ENSURE_CUSTOMER_RECORD } from "./constants";
import { CustomerJobData } from "./customer-record.processor";

const DELAY = 10_000;

@Injectable()
export class CustomerRecordService {
	constructor(
		@InjectQueue(CUSTOMER_RECORD) private customerRecordQueue: Queue,
		private readonly databaseService: DatabaseService,
	) {}

	async enqueueCustomerRecord(data: CustomerJobData) {
		await this.customerRecordQueue.add(ENSURE_CUSTOMER_RECORD, data, {
			delay: DELAY,
			attempts: 10,
			backoff: {
				type: "exponential",
				delay: DELAY,
			},
		});
	}

	async ensureCustomerRecord(record: {
		nickname: string;
		clientId: string;
		clientName: string;
		orgId: string;
	}) {
		const { clientId, clientName, nickname, orgId } = record;

		const existing = await getClientKycRecordByExternalReferenceId(
			{ externalReferenceId: clientId, organizationId: orgId },
			this.databaseService.client,
		);

		if (existing) return;

		await createClientKycRecord(
			{
				derivNickname: nickname,
				externalReferenceId: clientId,
				fullName: clientName,
				organizationId: orgId,
				status: KYC_STATUS.VERIFIED,
			},
			this.databaseService.client,
		);
	}
}
