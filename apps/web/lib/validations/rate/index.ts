import * as z from "zod";

export const RateUpdateSchema = z
	.object({
		deposit: z.coerce.number<number>().int().nonnegative(),
		withdrawal: z.coerce.number<number>().int().nonnegative(),
	})
	.refine(
		(data) =>
			data.deposit > data.withdrawal && data.deposit - data.withdrawal < 100,
		{
			error:
				"Deposit must be higher than withdrawal and should not exceed 100 naira spread",
			path: ["deposit"],
		},
	);
