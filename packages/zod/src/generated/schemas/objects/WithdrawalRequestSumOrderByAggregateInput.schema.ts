import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  amount: SortOrderSchema.optional(),
  amountNgn: SortOrderSchema.optional()
}).strict();
export const WithdrawalRequestSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestSumOrderByAggregateInput>;
export const WithdrawalRequestSumOrderByAggregateInputObjectZodSchema = makeSchema();
