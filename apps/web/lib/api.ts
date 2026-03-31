import { Cursor } from "@repo/db/queries";
import fetchHandler from "./handlers/fetchHandler";
import { clientEnv } from "./validations/env/client";

const getPayoutUrl = (cursor?: Cursor | null) => {
	return cursor
		? `${clientEnv.NEXT_PUBLIC_URL}/api/payouts?cursorId=${cursor.id}&cursorDate=${new Date(cursor.createdAt).toISOString()}`
		: `${clientEnv.NEXT_PUBLIC_URL}/api/payouts`;
};

export const api = {
	fetchPayouts: async <T>(cursor?: Cursor | null) => {
		return await fetchHandler<T>(getPayoutUrl(cursor));
	},
};
