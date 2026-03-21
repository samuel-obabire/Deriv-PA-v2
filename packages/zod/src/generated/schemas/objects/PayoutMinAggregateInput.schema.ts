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
export const PayoutMinAggregateInputObjectSchema: z.ZodType<Prisma.PayoutMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PayoutMinAggregateInputType>;
export const PayoutMinAggregateInputObjectZodSchema = makeSchema();
