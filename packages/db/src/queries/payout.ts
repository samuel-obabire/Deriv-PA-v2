import { and, desc, eq, gte, ilike, lt, lte, or } from "drizzle-orm";
import { payoutRequest } from "../db/schema";
import { DB } from "../types";
import { PAGE_LIMIT } from "./pagination";
import { PayoutOptions } from "./types";

export const getPayouts = async ({
	db,
	options,
}: {
	db: DB;
	options?: PayoutOptions;
}) => {
	const {
		limit = PAGE_LIMIT,
		cursor,
		date,
		searchQuery,
		status,
	} = options ?? {};

	const conditions = [];

	if (status) {
		conditions.push(eq(payoutRequest.status, status));
	}

	if (cursor) {
		conditions.push(
			or(
				lt(payoutRequest.createdAt, cursor.createdAt),
				and(
					eq(payoutRequest.createdAt, cursor.createdAt),
					lt(payoutRequest.id, cursor.id),
				),
			),
		);
	}

	if (date?.from && date?.to) {
		conditions.push(
			and(
				gte(payoutRequest.createdAt, date.from),
				lte(payoutRequest.createdAt, date.to),
			),
		);
	}

	if (searchQuery) {
		conditions.push(
			ilike(payoutRequest.recipientName, `%${searchQuery}%`),
		);
	}

	const payouts = await db
		.select()
		.from(payoutRequest)
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(desc(payoutRequest.createdAt), desc(payoutRequest.id))
		.limit(limit);

	return payouts;
};
