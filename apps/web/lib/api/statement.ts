import type {
	DerivCurrency,
	StatementQuery,
	StatementResult,
} from "@repo/deriv";
import fetchHandler from "@repo/lib/handlers/fetch";
import { ActionResponse } from "@repo/lib/types";
import { clientEnv } from "../validations/env/client";

export type StatementRequest = StatementQuery & { currency: DerivCurrency };

const buildStatementUrl = (options: StatementRequest) => {
	const params = new URLSearchParams();

	params.set("currency", options.currency);
	if (options.action_type) params.set("action_type", options.action_type);
	if (options.date_from !== undefined)
		params.set("date_from", String(options.date_from));
	if (options.date_to !== undefined)
		params.set("date_to", String(options.date_to));
	if (options.limit !== undefined) params.set("limit", String(options.limit));
	if (options.cursor) params.set("cursor", options.cursor);

	return `${clientEnv.NEXT_PUBLIC_URL}/api/statement?${params.toString()}`;
};

export type FetchStatementResponse = ActionResponse<StatementResult>;

export const statementApi = {
	getStatement: async (options: StatementRequest) => {
		return fetchHandler<FetchStatementResponse>(
			buildStatementUrl(options),
			undefined,
			20000,
		);
	},
};
