import { STATEMENT_ACTION_TYPE } from "@repo/deriv";
import { createZodDto } from "nestjs-zod";
import * as z from "zod";

const StatementSchema = z.object({
	statement: z.literal(1),
	action_type: z.enum(STATEMENT_ACTION_TYPE).optional(),
	date_from: z.number().optional(),
	date_to: z.number().optional(),
	description: z.literal(0).or(z.literal(1)).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export class StatementDto extends createZodDto(StatementSchema) {}
