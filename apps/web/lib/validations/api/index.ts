import * as z from "zod";

export const FetchPayoutSchema = z.object({
	cursorDate: z.coerce.date<string>().optional(),
	cursorId: z.string().optional(),
	limit: z.coerce.number<string>().int().positive().optional(),
});
