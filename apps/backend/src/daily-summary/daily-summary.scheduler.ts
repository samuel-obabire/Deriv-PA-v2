import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Queue } from "bullmq";
import {
	CREATE_DAILY_SUMMARY_JOBS,
	DAILY_SUMMARY,
	DAILY_SUMMARY_SCHEDULER_ID,
	LAGOS_TZ,
} from "./constants";

@Injectable()
export class DailySummaryScheduler implements OnModuleInit {
	constructor(@InjectQueue(DAILY_SUMMARY) private readonly queue: Queue) {}

	async onModuleInit() {
		await this.queue.upsertJobScheduler(
			DAILY_SUMMARY_SCHEDULER_ID,
			{
				pattern: "0 1 * * *",
				tz: LAGOS_TZ,
			},
			{
				name: CREATE_DAILY_SUMMARY_JOBS,
				data: {},
			},
		);
	}
}
