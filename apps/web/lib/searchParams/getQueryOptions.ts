import { ZodType } from "zod";
import { buildQueryOptions } from "@/utils/buildQueryOptions";
import { TransactionsQueryParamSchemaType } from "./payout";

export const getQueryOptions = <T extends TransactionsQueryParamSchemaType>({
	query,
	schema,
}: {
	query: unknown;
	schema: ZodType<T>;
}) => {
	const result = schema.safeParse(query);

	if (!result.success) return;

	const data = result.data;

	const queryOptions = buildQueryOptions(data);

	return queryOptions;
};
