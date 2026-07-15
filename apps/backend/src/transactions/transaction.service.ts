import { Injectable } from "@nestjs/common";
import { transaction } from "@repo/db";
import { CURRENCY, TRANSACTION_STATUS, TRANSACTION_TYPE } from "@repo/db/enums";
import { and, eq } from "drizzle-orm";
import { DatabaseService } from "src/database/database.service";

export interface CreateTransactionInput {
	clientId: string;
	amount: string;
	currency: CURRENCY;
	organizationId: string;
	staffId: string;
	idempotencyKey: string;
	depositRate: number;
	notes?: string;
}

@Injectable()
export class TransactionService {
	constructor(private readonly databaseService: DatabaseService) {}

	async findById(id: string) {
		const [row] = await this.databaseService.client
			.select()
			.from(transaction)
			.where(eq(transaction.id, id))
			.limit(1);

		return row ?? null;
	}

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
				depositRate: input.depositRate,
				notes: input.notes,
			})
			.returning();

		return inserted;
	}

	// Atomically claims a PENDING transaction for processing.
	// Returns the row only if it was still PENDING — null means someone else claimed it.
	async processing(id: string) {
		const [claimed] = await this.databaseService.client
			.update(transaction)
			.set({ status: TRANSACTION_STATUS.PROCESSING })
			.where(
				and(
					eq(transaction.id, id),
					eq(transaction.status, TRANSACTION_STATUS.PENDING),
				),
			)
			.returning();

		return claimed ?? null;
	}

	// Atomically cancels a PENDING transaction scoped to an org.
	// Returns the row only if it was PENDING and owned by orgId — null means it can't be cancelled.
	async cancelPending(id: string, organizationId: string) {
		const [cancelled] = await this.databaseService.client
			.update(transaction)
			.set({ status: TRANSACTION_STATUS.CANCELLED })
			.where(
				and(
					eq(transaction.id, id),
					eq(transaction.organizationId, organizationId),
					eq(transaction.status, TRANSACTION_STATUS.PENDING),
				),
			)
			.returning();

		return cancelled ?? null;
	}

	async complete(id: string, clientName: string | null, refId: number) {
		await this.databaseService.client
			.update(transaction)
			.set({
				clientName,
				refId,
				status: TRANSACTION_STATUS.COMPLETED,
			})
			.where(eq(transaction.id, id));
	}

	// refId is optional — a failed/rejected attempt still reports a
	// transaction_id from Deriv, but it isn't guaranteed if the request never
	// reached Deriv at all.
	async fail(id: string, refId?: number) {
		await this.databaseService.client
			.update(transaction)
			.set({
				status: TRANSACTION_STATUS.FAILED,
				...(refId !== undefined ? { refId } : {}),
			})
			.where(eq(transaction.id, id));
	}
}
