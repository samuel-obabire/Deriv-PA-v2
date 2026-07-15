import { STATEMENT_ACTION_TYPE } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const StatementSchema = z.object({
	action_type: z.enum(STATEMENT_ACTION_TYPE).optional(),
	date_from: z.number().optional(),
	date_to: z.number().optional(),
	limit: z.number().min(100).max(1000).optional(),
	cursor: z.string().optional(),
});

export class StatementDto extends createZodDto(StatementSchema) {}
