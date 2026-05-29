import { Injectable } from "@nestjs/common";
import { transaction } from "@repo/db";
import { CURRENCY, TRANSACTION_STATUS, TRANSACTION_TYPE } from "@repo/db/enums";
import { eq } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";

export interface CreateTransactionInput {
	clientId: string;
	amount: string;
	currency: CURRENCY;
	organizationId: string;
	staffId: string;
	idempotencyKey: string;
}

@Injectable()
export class TransactionService {
	constructor(private readonly databaseService: DatabaseService) {}

	async createPending(input: CreateTransactionInput) {
		const [inserted] = await this.databaseService.client
			.insert(transaction)
			.values({
				clientId: input.clientId,
				amount: input.amount,
				currency: input.currency,
				organizationId: input.organizationId,
				status: TRANSACTION_STATUS.PENDING,
				type: TRANSACTION_TYPE.DEPOSIT,
				idempotencyKey: input.idempotencyKey,
				staffId: input.staffId,
			})
			.returning();

		return inserted;
	}

	async complete(id: string, clientName: string) {
		await this.databaseService.client
			.update(transaction)
			.set({
				clientName,
				status: TRANSACTION_STATUS.COMPLETED,
			})
			.where(eq(transaction.id, id));
	}
}
