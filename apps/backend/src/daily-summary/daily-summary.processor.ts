import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import {
	CREATE_DAILY_SUMMARY_JOBS,
	DAILY_SUMMARY,
	GENERATE_ORGANIZATION_SUMMARY,
	SUMMARY_DAYS_AGO,
} from "./constants";
import { DailySummaryService } from "./daily-summary.service";
import { getBusinessDateRange } from "./daily-summary-date.util";
import type { GenerateOrganizationSummaryJobData } from "./daily-summary-queue.service";
import { DailySummaryQueueService } from "./daily-summary-queue.service";

@Processor(DAILY_SUMMARY)
export class DailySummaryProcessor extends WorkerHost {
	private readonly logger = new Logger(DailySummaryProcessor.name);

	constructor(
		private readonly queueService: DailySummaryQueueService,
		private readonly dailySummaryService: DailySummaryService,
	) {
		super();
	}

	async process(job: Job) {
		if (job.name === CREATE_DAILY_SUMMARY_JOBS) {
			await this.createOrganizationJobs();
			return;
		}

		if (job.name === GENERATE_ORGANIZATION_SUMMARY) {
			await this.generateOrganizationSummary(
				job as Job<GenerateOrganizationSummaryJobData>,
			);
			return;
		}

		this.logger.warn(`Job ${job.id} has unknown job name "${job.name}"`);
	}

	private async createOrganizationJobs() {
		for (const daysAgo of SUMMARY_DAYS_AGO) {
			const { businessDate } = getBusinessDateRange(new Date(), daysAgo);
			await this.queueService.enqueueAllOrganizations(businessDate);
		}
	}

	private async generateOrganizationSummary(
		job: Job<GenerateOrganizationSummaryJobData>,
	) {
		const { organizationId, businessDate } = job.data;
		await this.dailySummaryService.generateForOrganization(
			organizationId,
			new Date(businessDate),
		);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job, error: Error) {
		this.logger.error(
			`Job ${job.id} (${job.name}) failed — attempt: ${job.attemptsMade} | reason: ${error.message}`,
		);
	}

	@OnWorkerEvent("error")
	onError(error: Error) {
		this.logger.error(`Worker error — ${error.message}`, error.stack);
	}
}
