import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  amount: z.literal(true).optional()
}).strict();
export const PayoutAvgAggregateInputObjectSchema: z.ZodType<Prisma.PayoutAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PayoutAvgAggregateInputType>;
export const PayoutAvgAggregateInputObjectZodSchema = makeSchema();
