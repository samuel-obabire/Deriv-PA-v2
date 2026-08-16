import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { getAllOrganizations, getExistingSummaryKeys } from "@repo/db/queries";
import { DatabaseService } from "src/database/database.service";
import { RECOVERY_WINDOW_DAYS } from "./constants";
import {
	dailySummaryKey,
	getBusinessDateRange,
} from "./daily-summary-date.util";
import { DailySummaryQueueService } from "./daily-summary-queue.service";

@Injectable()
export class DailySummaryRecovery implements OnModuleInit {
	private readonly logger = new Logger(DailySummaryRecovery.name);

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly queueService: DailySummaryQueueService,
	) {}

	async onModuleInit() {
		await this.recoverMissingSummaries();
	}

	async recoverMissingSummaries() {
		const organizations = await getAllOrganizations(
			this.databaseService.client,
		);

		if (!organizations.length) {
			return;
		}

		const businessDates = Array.from(
			{ length: RECOVERY_WINDOW_DAYS },
			(_, i) => getBusinessDateRange(new Date(), i + 1).businessDate,
		);

		const existing = await getExistingSummaryKeys(
			{
				from: businessDates[businessDates.length - 1],
				to: businessDates[0],
			},
			this.databaseService.client,
		);
		const existingKeys = new Set(
			existing.map((row) =>
				dailySummaryKey(row.organizationId, row.businessDate),
			),
		);

		let recovered = 0;
		for (const organization of organizations) {
			for (const businessDate of businessDates) {
				if (existingKeys.has(dailySummaryKey(organization.id, businessDate))) {
					continue;
				}

				await this.queueService.enqueueOrganizationSummary(
					organization.id,
					businessDate,
				);
				recovered++;
			}
		}

		if (recovered > 0) {
			this.logger.log(
				`Queued ${recovered} missing daily summary job(s) across the last ${RECOVERY_WINDOW_DAYS} day(s)`,
			);
		}
	}
}
