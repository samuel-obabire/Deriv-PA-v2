import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  recipientName: SortOrderSchema.optional(),
  recipientAccount: SortOrderSchema.optional(),
  reciepientBank: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  withdrawalRequestId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  flagReason: SortOrderSchema.optional()
}).strict();
export const PayoutMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PayoutMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutMaxOrderByAggregateInput>;
export const PayoutMaxOrderByAggregateInputObjectZodSchema = makeSchema();
