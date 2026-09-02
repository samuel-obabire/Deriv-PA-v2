import type { Transaction } from "@repo/db";
import type { TransferStatusCheckOutcome } from "@repo/deriv";
import fetchHandler from "@repo/lib/handlers/fetch";
import { TokenPayload } from "@repo/utils";
import { ActionResponse } from "../../types/global";
import { clientEnv } from "../validations/env/client";
import { serverEnv } from "../validations/env/server";

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";

function serverFetch<T extends object, R>(
	url: string,
	method: HttpMethod,
	data: T,
) {
	return fetchHandler<R>(url, {
		method,
		headers: {
			Authorization: `Bearer ${serverEnv.BACKEND_API_TOKEN}`,
		},
		body: JSON.stringify(data),
	});
}

function serverGet<R>(url: string) {
	return fetchHandler<R>(url, {
		headers: {
			Authorization: `Bearer ${serverEnv.BACKEND_API_TOKEN}`,
		},
	});
}

export type TransferStatusCheckResponse = {
	transaction: Transaction;
	status: TransferStatusCheckOutcome;
};

export const serverApi = {
	getToken(payload: TokenPayload) {
		return serverFetch<TokenPayload, ActionResponse<{ accessToken: string }>>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/issue-token`,
			"POST",
			payload,
		);
	},

	revokeToken(userId: string) {
		return serverFetch<{ userId: string }, void>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/revoke-token`,
			"POST",
			{ userId },
		);
	},

	checkTransferStatus(transactionId: string, organizationId: string) {
		return serverGet<ActionResponse<TransferStatusCheckResponse>>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/transfers/${transactionId}/status?orgId=${organizationId}`,
		);
	},
};
