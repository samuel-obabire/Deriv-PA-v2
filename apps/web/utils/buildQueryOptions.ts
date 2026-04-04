import { PayoutOptions } from "@repo/db/queries";
import { TransactionQuerySchemaType } from "@/lib/validations/pagination.schema";

export const buildQueryOptions = (
	data: TransactionQuerySchemaType,
): PayoutOptions => ({
	...(data.from &&
		data.to && {
			date: { from: data.from, to: data.to },
		}),
	...(data.limit && { limit: data.limit }),
	...(data.searchQuery && { searchQuery: data.searchQuery }),
	...(data.status && { status: data.status }),
});
