import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  derivId: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  amountNgn: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  derivRef: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const WithdrawalRequestMaxAggregateInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestMaxAggregateInputType>;
export const WithdrawalRequestMaxAggregateInputObjectZodSchema = makeSchema();
