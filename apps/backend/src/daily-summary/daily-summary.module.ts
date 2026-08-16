import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { DAILY_SUMMARY } from "./constants";
import { DailySummaryProcessor } from "./daily-summary.processor";
import { DailySummaryRecovery } from "./daily-summary.recovery";
import { DailySummaryScheduler } from "./daily-summary.scheduler";
import { DailySummaryService } from "./daily-summary.service";
import { DailySummaryQueueService } from "./daily-summary-queue.service";

@Module({
	imports: [
		BullModule.registerQueue({
			name: DAILY_SUMMARY,
			defaultJobOptions: {
				removeOnComplete: 1000,
				removeOnFail: 3000,
			},
		}),
		DatabaseModule,
	],
	providers: [
		DailySummaryQueueService,
		DailySummaryProcessor,
		DailySummaryService,
		DailySummaryScheduler,
		DailySummaryRecovery,
	],
	exports: [DailySummaryQueueService, DailySummaryService],
})
export class DailySummaryModule {}
