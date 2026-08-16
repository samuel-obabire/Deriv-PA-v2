import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { getAllOrganizations } from "@repo/db/queries";
import { Job, Queue } from "bullmq";
import { DatabaseService } from "src/database/database.service";
import { DAILY_SUMMARY, GENERATE_ORGANIZATION_SUMMARY } from "./constants";
import { dailySummaryJobId } from "./daily-summary-date.util";

export type GenerateOrganizationSummaryJobData = {
	organizationId: string;
	businessDate: string;
};

@Injectable()
export class DailySummaryQueueService {
	constructor(
		@InjectQueue(DAILY_SUMMARY) private readonly queue: Queue,
		private readonly databaseService: DatabaseService,
	) {}

	async enqueueOrganizationSummary(organizationId: string, businessDate: Date) {
		const jobId = dailySummaryJobId(organizationId, businessDate);

		// BullMQ treats an add() with a colliding jobId as a no-op duplicate —
		// it returns the existing job untouched, even if that job already ran
		// to a terminal state. Without this, a permanently-failed job can
		// never be retried by recovery, and a completed job can never be
		// deliberately recomputed — both re-add with this same jobId.
		const existingJob = await this.queue.getJob(jobId);
		if (existingJob && (await this.isTerminal(existingJob))) {
			await existingJob.remove();
		}

		await this.queue.add(
			GENERATE_ORGANIZATION_SUMMARY,
			{
				organizationId,
				businessDate: businessDate.toISOString(),
			} satisfies GenerateOrganizationSummaryJobData,
			{
				jobId,
				attempts: 5,
				backoff: {
					type: "exponential",
					delay: 60_000,
				},
			},
		);
	}

	private async isTerminal(job: Job) {
		return (await job.isCompleted()) || (await job.isFailed());
	}

	async enqueueAllOrganizations(businessDate: Date) {
		const organizations = await getAllOrganizations(
			this.databaseService.client,
		);

		await Promise.all(
			organizations.map((organization) =>
				this.enqueueOrganizationSummary(organization.id, businessDate),
			),
		);
	}
}
