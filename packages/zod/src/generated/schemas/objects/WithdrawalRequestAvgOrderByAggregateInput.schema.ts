import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  amount: SortOrderSchema.optional(),
  amountNgn: SortOrderSchema.optional()
}).strict();
export const WithdrawalRequestAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestAvgOrderByAggregateInput>;
export const WithdrawalRequestAvgOrderByAggregateInputObjectZodSchema = makeSchema();
