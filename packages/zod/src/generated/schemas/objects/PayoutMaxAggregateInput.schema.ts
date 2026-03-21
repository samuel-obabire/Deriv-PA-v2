import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  recipientName: z.literal(true).optional(),
  recipientAccount: z.literal(true).optional(),
  reciepientBank: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  withdrawalRequestId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  flagReason: z.literal(true).optional()
}).strict();
export const PayoutMaxAggregateInputObjectSchema: z.ZodType<Prisma.PayoutMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PayoutMaxAggregateInputType>;
export const PayoutMaxAggregateInputObjectZodSchema = makeSchema();
