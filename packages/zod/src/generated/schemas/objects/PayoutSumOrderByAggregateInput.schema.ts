import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  amount: SortOrderSchema.optional()
}).strict();
export const PayoutSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PayoutSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutSumOrderByAggregateInput>;
export const PayoutSumOrderByAggregateInputObjectZodSchema = makeSchema();
