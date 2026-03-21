import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PayoutCountOrderByAggregateInputObjectSchema as PayoutCountOrderByAggregateInputObjectSchema } from './PayoutCountOrderByAggregateInput.schema';
import { PayoutAvgOrderByAggregateInputObjectSchema as PayoutAvgOrderByAggregateInputObjectSchema } from './PayoutAvgOrderByAggregateInput.schema';
import { PayoutMaxOrderByAggregateInputObjectSchema as PayoutMaxOrderByAggregateInputObjectSchema } from './PayoutMaxOrderByAggregateInput.schema';
import { PayoutMinOrderByAggregateInputObjectSchema as PayoutMinOrderByAggregateInputObjectSchema } from './PayoutMinOrderByAggregateInput.schema';
import { PayoutSumOrderByAggregateInputObjectSchema as PayoutSumOrderByAggregateInputObjectSchema } from './PayoutSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  recipientName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  recipientAccount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reciepientBank: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  withdrawalRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  flagReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => PayoutCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => PayoutAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PayoutMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PayoutMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => PayoutSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PayoutOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PayoutOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutOrderByWithAggregationInput>;
export const PayoutOrderByWithAggregationInputObjectZodSchema = makeSchema();
