import { and, desc, eq, lt, or } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { PayoutRequest, payoutRequest } from "../db/schema/payoutRequest";
import { PAGE_LIMIT } from "./pagination";

export type Cursor = Pick<PayoutRequest, "createdAt" | "id">;

export const getPayouts = async ({
	db,
	limit = PAGE_LIMIT,
	cursor,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: type any needed in this case
	db: PostgresJsDatabase<any>;
	limit?: number;
	cursor?: Cursor;
}) => {
	const payouts = await db
		.select()
		.from(payoutRequest)
		.orderBy(desc(payoutRequest.createdAt), desc(payoutRequest.id))
		.limit(limit)
		.where(
			cursor
				? or(
						lt(payoutRequest.createdAt, cursor.createdAt),

						and(
							eq(payoutRequest.createdAt, cursor.createdAt),
							lt(payoutRequest.id, cursor.id),
						),
					)
				: undefined,
		);

	return payouts;
};
