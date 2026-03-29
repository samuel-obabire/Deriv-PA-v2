import { and, desc, eq, gt, lt, or } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { PayoutRequest, payoutRequest } from "../db/schema/payoutRequest";

export const PAGE_LIMIT = 20;

export const getPayouts = async ({
	db,
	limit = PAGE_LIMIT,
	cursor,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: type any needed in this case
	db: PostgresJsDatabase<any>;
	limit?: number;
	cursor?: PayoutRequest;
}) => {
	const payouts = await db
		.select()
		.from(payoutRequest)
		.orderBy(desc(payoutRequest.createdAt), desc(payoutRequest.id))
		.limit(limit)
		.where(
			cursor
				? or(
						gt(payoutRequest.createdAt, cursor.createdAt),

						and(
							eq(payoutRequest.createdAt, cursor.createdAt),
							lt(payoutRequest.id, cursor.id),
						),
					)
				: undefined,
		);

	return payouts;
};
