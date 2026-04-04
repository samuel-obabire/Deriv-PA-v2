import { ZodType } from "zod";
import { buildQueryOptions } from "@/utils/buildQueryOptions";
import { TransactionQuerySchemaType } from "../validations/pagination.schema";

export const getQueryOptions = <T extends TransactionQuerySchemaType>({
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
