import { PayoutStatusEnum } from "@repo/db";
import * as z from "zod";

export const FetchPaginatedPayoutSchema = z.object({
	cursorDate: z.coerce.date<string>().optional(),
	cursorId: z.string().optional(),
	limit: z.coerce.number<string>().int().positive().optional(),
	searchQuery: z.string().optional(),
	status: z.enum(PayoutStatusEnum.enumValues).optional(),
	from: z.coerce.date<string>().optional(),
	to: z.coerce.date<string>().optional(),
});
