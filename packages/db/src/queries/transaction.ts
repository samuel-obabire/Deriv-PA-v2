import {
	and,
	desc,
	eq,
	gte,
	lt,
	lte,
	notInArray,
	or,
	type SQLWrapper,
	sql,
} from "drizzle-orm";
import { transaction } from "../db/schema";
import { TRANSACTION_STATUS } from "../enums";
import { DB } from "../types";
import { PAGE_LIMIT } from "./pagination";
import { TransactionPaginationOption } from "./types";

type GetRecentTransfersOptions = {
	limit?: number;
};

export const getRecentTransfersByOrg = async (
	organizationId: string,
	db: DB,
	{ limit = 5 }: GetRecentTransfersOptions = {},
) => {
	return db
		.select()
		.from(transaction)
		.where(eq(transaction.organizationId, organizationId))
		.orderBy(desc(transaction.createdAt))
		.limit(limit);
};

export const getMostRecentTransferForClient = async (
	organizationId: string,
	clientId: string,
	db: DB,
) => {
	const [row] = await db
		.select()
		.from(transaction)
		.where(
			and(
				eq(transaction.organizationId, organizationId),
				eq(transaction.clientId, clientId),
			),
		)
		.orderBy(desc(transaction.createdAt))
		.limit(1);

	return row ?? null;
};

export const getTransactions = async ({
	organizationId,
	paginationOptions,
	db,
}: {
	db: DB;
	organizationId: string;
	paginationOptions?: TransactionPaginationOption;
}) => {
	const {
		limit = PAGE_LIMIT,
		cursor,
		date_from,
		date_to,
		status,
		amount,
		clientId,
	} = paginationOptions ?? {};

	const conditions: (SQLWrapper | undefined)[] = [
		eq(transaction.organizationId, organizationId),
	];

	if (cursor) {
		conditions.push(
			or(
				lt(transaction.createdAt, cursor.createdAt),
				and(
					eq(transaction.createdAt, cursor.createdAt),
					lt(transaction.id, cursor.id),
				),
			),
		);
	}

	if (date_from) {
		conditions.push(gte(transaction.createdAt, date_from));
	}

	if (date_to) {
		conditions.push(lte(transaction.createdAt, date_to));
	}

	if (status) {
		conditions.push(eq(transaction.status, status));
	}

	if (amount) {
		// amount is a numeric(12,2) column stored/returned as a fixed 2dp string
		conditions.push(eq(transaction.amount, amount.toFixed(2)));
	}

	if (clientId) {
		const lowerClientId = sql`lower(${transaction.clientId}) = lower(${clientId})`;

		conditions.push(lowerClientId);
	}

	const transactions = await db
		.select()
		.from(transaction)
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(desc(transaction.createdAt), desc(transaction.id))
		.limit(limit);

	return transactions;
};

export const getOrganizationTransactionSummary = async (
	organizationId: string,
	range: { start: Date; end: Date },
	db: DB,
) => {
	const notDead = notInArray(transaction.status, [
		TRANSACTION_STATUS.FAILED,
		TRANSACTION_STATUS.CANCELLED,
	]);
	const completed = eq(transaction.status, TRANSACTION_STATUS.COMPLETED);
	const cancelled = eq(transaction.status, TRANSACTION_STATUS.CANCELLED);
	const failed = eq(transaction.status, TRANSACTION_STATUS.FAILED);

	const [row] = await db
		.select({
			totalCount: sql<number>`count(*) filter (where ${notDead})::int`,
			totalAmount: sql<string>`coalesce(sum(${transaction.amount}) filter (where ${notDead}), 0)`,
			totalNgnAmount: sql<string>`coalesce(sum(${transaction.ngnAmount}) filter (where ${notDead}), 0)`,
			totalSuccessful: sql<number>`count(*) filter (where ${completed})::int`,
			totalSuccessfulAmount: sql<string>`coalesce(sum(${transaction.amount}) filter (where ${completed}), 0)`,
			totalCancelled: sql<number>`count(*) filter (where ${cancelled})::int`,
			totalFailed: sql<number>`count(*) filter (where ${failed})::int`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.organizationId, organizationId),
				gte(transaction.createdAt, range.start),
				lt(transaction.createdAt, range.end),
			),
		);

	return row;
};
