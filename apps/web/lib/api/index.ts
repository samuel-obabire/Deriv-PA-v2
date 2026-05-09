import { Cursor } from "@repo/db/queries";

import fetchHandler from "../handlers/fetchHandler";
import { clientEnv } from "../validations/env/client";
import { tokenService } from "./token-service";

const getPayoutUrl = (searchParams: string, cursor?: Cursor | null) => {
	return cursor
		? `${clientEnv.NEXT_PUBLIC_URL}/api/payouts?cursorId=${cursor.id}&cursorDate=${new Date(cursor.createdAt).toISOString()}&${searchParams}`
		: `${clientEnv.NEXT_PUBLIC_URL}/api/payouts?${searchParams}`;
};

export const api = {
	fetchPayouts: async <T>(searchParams: string, cursor?: Cursor | null) => {
		return await fetchHandler<T>(getPayoutUrl(searchParams, cursor));
	},

	tokenService: tokenService,
};
