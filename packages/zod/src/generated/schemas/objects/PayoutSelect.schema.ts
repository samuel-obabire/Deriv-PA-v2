import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestArgsObjectSchema as WithdrawalRequestArgsObjectSchema } from './WithdrawalRequestArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  amount: z.boolean().optional(),
  recipientName: z.boolean().optional(),
  recipientAccount: z.boolean().optional(),
  reciepientBank: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  withdrawalRequestId: z.boolean().optional(),
  withdrawal: z.union([z.boolean(), z.lazy(() => WithdrawalRequestArgsObjectSchema)]).optional(),
  status: z.boolean().optional(),
  flagReason: z.boolean().optional()
}).strict();
export const PayoutSelectObjectSchema: z.ZodType<Prisma.PayoutSelect> = makeSchema() as unknown as z.ZodType<Prisma.PayoutSelect>;
export const PayoutSelectObjectZodSchema = makeSchema();
