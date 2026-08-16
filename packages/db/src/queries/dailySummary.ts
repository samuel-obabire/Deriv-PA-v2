import { and, desc, eq, gte, lt, lte, or, type SQLWrapper } from "drizzle-orm";
import { dailySummary, InsertDailySummary } from "../db/schema";
import { DB } from "../types";
import { PAGE_LIMIT } from "./pagination";
import { DailySummaryPaginationOption } from "./types";

export const upsertDailySummary = async (
	values: InsertDailySummary,
	db: DB,
) => {
	const [row] = await db
		.insert(dailySummary)
		.values(values)
		.onConflictDoUpdate({
			target: [dailySummary.organizationId, dailySummary.businessDate],
			set: {
				totalAmount: values.totalAmount,
				totalSuccessfulAmount: values.totalSuccessfulAmount,
				totalCount: values.totalCount,
				totalSuccessful: values.totalSuccessful,
				totalCancelled: values.totalCancelled,
				totalFailed: values.totalFailed,
			},
		})
		.returning();

	if (!row) {
		throw new Error("Failed to upsert daily summary");
	}

	return row;
};

export const getExistingSummaryKeys = async (
	range: { from: Date; to: Date },
	db: DB,
) => {
	return db
		.select({
			organizationId: dailySummary.organizationId,
			businessDate: dailySummary.businessDate,
		})
		.from(dailySummary)
		.where(
			and(
				gte(dailySummary.businessDate, range.from),
				lte(dailySummary.businessDate, range.to),
			),
		);
};

export const getDailySummaries = async ({
	organizationId,
	paginationOptions,
	db,
}: {
	db: DB;
	organizationId: string;
	paginationOptions?: DailySummaryPaginationOption;
}) => {
	const {
		limit = PAGE_LIMIT,
		cursor,
		date_from,
		date_to,
	} = paginationOptions ?? {};

	const conditions: (SQLWrapper | undefined)[] = [
		eq(dailySummary.organizationId, organizationId),
	];

	if (cursor) {
		conditions.push(
			or(
				lt(dailySummary.businessDate, cursor.businessDate),
				and(
					eq(dailySummary.businessDate, cursor.businessDate),
					lt(dailySummary.id, cursor.id),
				),
			),
		);
	}

	if (date_from) {
		conditions.push(gte(dailySummary.businessDate, date_from));
	}

	if (date_to) {
		conditions.push(lte(dailySummary.businessDate, date_to));
	}

	return db
		.select()
		.from(dailySummary)
		.where(and(...conditions))
		.orderBy(desc(dailySummary.businessDate), desc(dailySummary.id))
		.limit(limit);
};
