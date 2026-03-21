import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WithdrawalRequestCountOrderByAggregateInputObjectSchema as WithdrawalRequestCountOrderByAggregateInputObjectSchema } from './WithdrawalRequestCountOrderByAggregateInput.schema';
import { WithdrawalRequestAvgOrderByAggregateInputObjectSchema as WithdrawalRequestAvgOrderByAggregateInputObjectSchema } from './WithdrawalRequestAvgOrderByAggregateInput.schema';
import { WithdrawalRequestMaxOrderByAggregateInputObjectSchema as WithdrawalRequestMaxOrderByAggregateInputObjectSchema } from './WithdrawalRequestMaxOrderByAggregateInput.schema';
import { WithdrawalRequestMinOrderByAggregateInputObjectSchema as WithdrawalRequestMinOrderByAggregateInputObjectSchema } from './WithdrawalRequestMinOrderByAggregateInput.schema';
import { WithdrawalRequestSumOrderByAggregateInputObjectSchema as WithdrawalRequestSumOrderByAggregateInputObjectSchema } from './WithdrawalRequestSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  derivId: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  amountNgn: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  derivRef: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => WithdrawalRequestCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WithdrawalRequestAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WithdrawalRequestMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WithdrawalRequestMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WithdrawalRequestSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WithdrawalRequestOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestOrderByWithAggregationInput>;
export const WithdrawalRequestOrderByWithAggregationInputObjectZodSchema = makeSchema();
