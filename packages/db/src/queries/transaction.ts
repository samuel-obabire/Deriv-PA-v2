import { and, desc, eq, gte, lt, lte, or, type SQLWrapper } from "drizzle-orm";
import { transaction } from "../db/schema";
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
		conditions.push(eq(transaction.clientId, clientId));
	}

	const transactions = await db
		.select()
		.from(transaction)
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(desc(transaction.createdAt), desc(transaction.id))
		.limit(limit);

	return transactions;
};
