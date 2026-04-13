import { Injectable } from "@nestjs/common";
import { withdrawalRequest } from "@repo/db";
import { WITHDRAWAL_STATUS } from "@repo/db/enums";
import { and, eq, or, sql } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";

const TOLERANCE = 3;

@Injectable()
export class MatcherService {
	constructor(private readonly databaseService: DatabaseService) {}

	async findPayoutMatch({
		amount,
		narration,
		cr,
	}: {
		amount: number;
		narration: string;
		cr: string | null;
	}) {
		const min = amount - TOLERANCE;
		const max = amount + TOLERANCE;

		const whereCondition = cr
			? or(
					and(
						eq(withdrawalRequest.derivId, cr),
						eq(withdrawalRequest.status, WITHDRAWAL_STATUS.PENDING),
						sql`${withdrawalRequest.createdAt} >= NOW() - INTERVAL '59 minutes'`,
						sql`${withdrawalRequest.amountNgn} BETWEEN ${min} AND ${max}`,
					),

					and(
						eq(withdrawalRequest.status, WITHDRAWAL_STATUS.PENDING),
						sql`${withdrawalRequest.createdAt} >= NOW() - INTERVAL '59 minutes'`,
						sql`word_similarity(${withdrawalRequest.clientName}, ${narration}) > 0.3`,
						sql`${withdrawalRequest.amountNgn} BETWEEN ${min} AND ${max}`,
					),
				)
			: and(
					eq(withdrawalRequest.status, WITHDRAWAL_STATUS.PENDING),
					sql`${withdrawalRequest.createdAt} >= NOW() - INTERVAL '59 minutes'`,
					sql`word_similarity(${withdrawalRequest.clientName}, ${narration}) > 0.3`,
					sql`${withdrawalRequest.amountNgn} BETWEEN ${min} AND ${max}`,
				);

		const bestMatchingDerivWithdrawal =
			await this.databaseService.client.query.withdrawalRequest.findFirst({
				where: whereCondition,
			});

		return bestMatchingDerivWithdrawal;
	}
}
