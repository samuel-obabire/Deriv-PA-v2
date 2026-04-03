import { PayoutOptions } from "@repo/db/queries";
import { TransactionsQueryParamSchemaType } from "@/lib/searchParams/payout";

export const buildQueryOptions = (
	data: TransactionsQueryParamSchemaType,
): PayoutOptions => ({
	...(data.from &&
		data.to && {
			date: { from: data.from, to: data.to },
		}),
	...(data.limit && { limit: data.limit }),
	...(data.searchQuery && { searchQuery: data.searchQuery }),
	...(data.status && { status: data.status }),
});
