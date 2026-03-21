import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  amount: z.literal(true).optional(),
  amountNgn: z.literal(true).optional()
}).strict();
export const WithdrawalRequestSumAggregateInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestSumAggregateInputType>;
export const WithdrawalRequestSumAggregateInputObjectZodSchema = makeSchema();
