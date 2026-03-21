import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  derivId: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  amountNgn: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  derivRef: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const WithdrawalRequestMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestMaxOrderByAggregateInput>;
export const WithdrawalRequestMaxOrderByAggregateInputObjectZodSchema = makeSchema();
