import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  amount: z.literal(true).optional()
}).strict();
export const PayoutSumAggregateInputObjectSchema: z.ZodType<Prisma.PayoutSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PayoutSumAggregateInputType>;
export const PayoutSumAggregateInputObjectZodSchema = makeSchema();
