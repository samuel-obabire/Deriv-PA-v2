import { Transaction } from "@repo/db";
import { PaginationCursor } from "@repo/db/queries";
import fetchHandler from "@repo/lib/handlers/fetch";
import { ActionResponse } from "@repo/lib/types";
import { clientEnv } from "../validations/env/client";
import type { TransferStatusCheckResponse } from "./server-api";

const getTransactionUrl = (
	searchParams?: string,
	cursor?: PaginationCursor | null,
) => {
	const params = new URLSearchParams(searchParams);

	if (cursor) {
		params.set("cursorId", cursor.id);
		params.set("cursorDate", new Date(cursor.createdAt).toISOString());
	}

	return `${clientEnv.NEXT_PUBLIC_URL}/api/transactions?${params.toString()}`;
};

export type FetchTransactionResponse = ActionResponse<{
	transactions: Transaction[];
	cursor?: PaginationCursor;
}>;

export const transactionService = {
	getTransactions: async (searchParams: string, cursor?: PaginationCursor) => {
		return fetchHandler<FetchTransactionResponse>(
			getTransactionUrl(searchParams, cursor),
		);
	},

	checkTransferStatus: async (transactionId: string) => {
		return fetchHandler<ActionResponse<TransferStatusCheckResponse>>(
			`${clientEnv.NEXT_PUBLIC_URL}/api/transactions/${transactionId}/transfer-status`,
		);
	},
};
