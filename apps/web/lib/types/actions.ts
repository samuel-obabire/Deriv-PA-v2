import { PayoutRequest } from "@repo/db";
import { Cursor } from "@repo/db/queries";

export type FetchPayoutResponse = ActionResponse<{
	transactions: PayoutRequest[];
	cursor: Cursor | undefined;
}>;
