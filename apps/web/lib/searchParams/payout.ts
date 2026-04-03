import { PayoutStatusEnum } from "@repo/db";
import {
	createSearchParamsCache,
	parseAsInteger,
	parseAsIsoDate,
	parseAsString,
} from "nuqs/server";
import * as z from "zod";

export const payoutSearchParams = {
	from: parseAsIsoDate,
	to: parseAsIsoDate,
	status: parseAsString,
	limit: parseAsInteger,
	searchQuery: parseAsString,
};

export const TransactionsQueryParamSchema = z.object({
	searchQuery: z
		.string()
		.nullable()
		.transform((val) => val ?? undefined),
	limit: z
		.int()
		.nonnegative()
		.nullable()
		.transform((val) => val ?? undefined),
	from: z
		.date()
		.nullable()
		.transform((val) => val ?? undefined),
	to: z
		.date()
		.nullable()
		.transform((val) => val ?? undefined),
	status: z
		.enum(PayoutStatusEnum.enumValues)
		.nullable()
		.transform((val) => val ?? undefined),
});

export type TransactionsQueryParamSchemaType = z.infer<
	typeof TransactionsQueryParamSchema
>;

export const payoutSearchParamsCache =
	createSearchParamsCache(payoutSearchParams);
