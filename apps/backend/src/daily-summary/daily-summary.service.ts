import { Injectable } from "@nestjs/common";
import {
	getOrganizationTransactionSummary,
	upsertDailySummary,
} from "@repo/db/queries";
import { DatabaseService } from "src/database/database.service";
import { getBusinessDateRangeForDate } from "./daily-summary-date.util";

@Injectable()
export class DailySummaryService {
	constructor(private readonly databaseService: DatabaseService) {}

	async generateForOrganization(organizationId: string, businessDate: Date) {
		const { startUtc, endUtc } = getBusinessDateRangeForDate(businessDate);

		const summary = await getOrganizationTransactionSummary(
			organizationId,
			{ start: startUtc, end: endUtc },
			this.databaseService.client,
		);

		return upsertDailySummary(
			{
				organizationId,
				businessDate,
				totalAmount: summary.totalAmount,
				totalSuccessfulAmount: summary.totalSuccessfulAmount,
				totalNgnAmount: summary.totalNgnAmount,
				totalCount: summary.totalCount,
				totalSuccessful: summary.totalSuccessful,
				totalCancelled: summary.totalCancelled,
				totalFailed: summary.totalFailed,
			},
			this.databaseService.client,
		);
	}
}
