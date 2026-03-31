import { Injectable, InternalServerErrorException } from "@nestjs/common";
import {
	payoutRequest,
	WithdrawalRequest,
	WithdrawalStatusEnum,
	withdrawalRequest,
} from "@repo/db";
import { and, eq } from "drizzle-orm";
import { ParsedDerivEmail } from "src/common/types/parser";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ProcessorService {
	constructor(private readonly databaseService: DatabaseService) {}

	async processMatch(
		matchedWithdrawal: WithdrawalRequest,
		parsed: ParsedDerivEmail,
	) {
		await this.databaseService.client.transaction(async (tx) => {
			const result = await tx
				.update(withdrawalRequest)
				.set({
					status: WithdrawalStatusEnum.enumValues[1],
				})
				.where(
					and(
						eq(withdrawalRequest.id, matchedWithdrawal.id),
						eq(withdrawalRequest.status, "PENDING"),
					),
				)
				.returning();

			if (result.length === 0)
				throw new InternalServerErrorException("Withdrawal update failed");

			await tx.insert(payoutRequest).values({
				amountNgn: parsed.amount.toString(),
				recipientName: parsed.narration,
				clientCR: parsed.cr,
				status: WithdrawalStatusEnum.enumValues.find((v) => v === "MATCHED"),
				withdrawalId: matchedWithdrawal.id,
			});
		});
	}

	async processUnmatched(parsed: ParsedDerivEmail) {
		await this.databaseService.client.insert(payoutRequest).values({
			amountNgn: parsed.amount.toString(),
			recipientName: parsed.narration,
			clientCR: parsed.cr,
			status: WithdrawalStatusEnum.enumValues[2],
		});
	}
}
