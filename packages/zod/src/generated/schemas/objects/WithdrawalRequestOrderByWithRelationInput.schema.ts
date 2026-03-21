import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PayoutOrderByWithRelationInputObjectSchema as PayoutOrderByWithRelationInputObjectSchema } from './PayoutOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  derivId: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  amountNgn: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  derivRef: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  payout: z.lazy(() => PayoutOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WithdrawalRequestOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestOrderByWithRelationInput>;
export const WithdrawalRequestOrderByWithRelationInputObjectZodSchema = makeSchema();
