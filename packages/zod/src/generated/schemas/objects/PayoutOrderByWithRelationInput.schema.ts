import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WithdrawalRequestOrderByWithRelationInputObjectSchema as WithdrawalRequestOrderByWithRelationInputObjectSchema } from './WithdrawalRequestOrderByWithRelationInput.schema'

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
  withdrawal: z.lazy(() => WithdrawalRequestOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const PayoutOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PayoutOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutOrderByWithRelationInput>;
export const PayoutOrderByWithRelationInputObjectZodSchema = makeSchema();
