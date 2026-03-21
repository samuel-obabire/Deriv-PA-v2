import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';
import { PayoutUncheckedCreateNestedOneWithoutWithdrawalInputObjectSchema as PayoutUncheckedCreateNestedOneWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedCreateNestedOneWithoutWithdrawalInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  derivId: z.string(),
  amount: z.number(),
  amountNgn: z.number(),
  currency: z.string().optional(),
  derivRef: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  status: WithdrawalStatusSchema.optional(),
  payout: z.lazy(() => PayoutUncheckedCreateNestedOneWithoutWithdrawalInputObjectSchema).optional()
}).strict();
export const WithdrawalRequestUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestUncheckedCreateInput>;
export const WithdrawalRequestUncheckedCreateInputObjectZodSchema = makeSchema();
