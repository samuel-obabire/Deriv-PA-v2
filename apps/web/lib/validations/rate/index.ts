import * as z from "zod";

export const RateUpdateSchema = z
	.object({
		deposit: z.coerce.number<number>().int().nonnegative(),
		withdrawal: z.coerce.number<number>().int().nonnegative(),
		charge: z.coerce.number<number>().int().nonnegative(),
		smallAmount: z.coerce.number<number>().int().nonnegative(),
		min: z.coerce.number<number>().int().positive(),
		max: z.coerce.number<number>().int().positive(),
	})
	.refine(
		(data) =>
			data.deposit > data.withdrawal && data.deposit - data.withdrawal < 100,
		{
			error:
				"Deposit must be higher than withdrawal and should not exceed 100 naira spread",
			path: ["deposit"],
		},
	)
	.refine((data) => data.max > data.min, {
		error: "Maximum amount must be greater than minimum amount",
		path: ["max"],
	});
