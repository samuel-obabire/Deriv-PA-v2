import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  amount: z.number(),
  recipientName: z.string().optional().nullable(),
  recipientAccount: z.string().optional().nullable(),
  reciepientBank: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  withdrawalRequestId: z.string().optional().nullable(),
  status: PayoutStatusSchema.optional(),
  flagReason: z.string().optional().nullable()
}).strict();
export const PayoutCreateManyInputObjectSchema: z.ZodType<Prisma.PayoutCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutCreateManyInput>;
export const PayoutCreateManyInputObjectZodSchema = makeSchema();
