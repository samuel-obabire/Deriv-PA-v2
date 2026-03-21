import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  amount: SortOrderSchema.optional()
}).strict();
export const PayoutAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PayoutAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutAvgOrderByAggregateInput>;
export const PayoutAvgOrderByAggregateInputObjectZodSchema = makeSchema();
