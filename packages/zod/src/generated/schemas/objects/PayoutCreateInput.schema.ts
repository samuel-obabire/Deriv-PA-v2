import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';
import { WithdrawalRequestCreateNestedOneWithoutPayoutInputObjectSchema as WithdrawalRequestCreateNestedOneWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateNestedOneWithoutPayoutInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  amount: z.number(),
  recipientName: z.string().optional().nullable(),
  recipientAccount: z.string().optional().nullable(),
  reciepientBank: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  status: PayoutStatusSchema.optional(),
  flagReason: z.string().optional().nullable(),
  withdrawal: z.lazy(() => WithdrawalRequestCreateNestedOneWithoutPayoutInputObjectSchema).optional()
}).strict();
export const PayoutCreateInputObjectSchema: z.ZodType<Prisma.PayoutCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutCreateInput>;
export const PayoutCreateInputObjectZodSchema = makeSchema();
