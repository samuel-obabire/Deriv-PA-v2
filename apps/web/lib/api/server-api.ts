import type {
	ClientNameValidationResult,
	PaymentAgentTransferInput,
} from "@repo/deriv";
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

type TransferOptions = {
	ignoreDuplicatePayment?: boolean;
};

export type ValidateTransferPayload = {
	organizationId: string;
	tokenId: string;
	data: PaymentAgentTransferInput;
	options: TransferOptions;
};

export type ScheduleTransferPayload = {
	organizationId: string;
	tokenId: string;
	userId: string;
	data: PaymentAgentTransferInput;
	options: TransferOptions & {
		idempotencyKey: string;
		notes?: string;
		depositRate: number;
	};
};

export type ScheduledTransfer = {
	id: string;
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

	validatePaymentAgentTransfer(payload: ValidateTransferPayload) {
		return serverFetch<
			ValidateTransferPayload,
			ActionResponse<ClientNameValidationResult>
		>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/transfers/validate`,
			"POST",
			payload,
		);
	},

	scheduleTransfer(payload: ScheduleTransferPayload) {
		return serverFetch<
			ScheduleTransferPayload,
			ActionResponse<ScheduledTransfer>
		>(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/transfers`, "POST", payload);
	},
};
