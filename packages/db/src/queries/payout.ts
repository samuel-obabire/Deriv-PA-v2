import { and, desc, eq, lt, or } from "drizzle-orm";

import { PayoutRequest, payoutRequest } from "../db/schema/payoutRequest";
import { DB } from "../types";
import { PAGE_LIMIT } from "./pagination";

export type Cursor = Pick<PayoutRequest, "createdAt" | "id">;

export const getPayouts = async ({
	db,
	limit = PAGE_LIMIT,
	cursor,
}: {
	db: DB;
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
