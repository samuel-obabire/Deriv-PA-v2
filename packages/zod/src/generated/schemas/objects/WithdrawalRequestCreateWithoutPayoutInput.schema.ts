import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  derivId: z.string(),
  amount: z.number(),
  amountNgn: z.number(),
  currency: z.string().optional(),
  derivRef: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  status: WithdrawalStatusSchema.optional()
}).strict();
export const WithdrawalRequestCreateWithoutPayoutInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestCreateWithoutPayoutInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestCreateWithoutPayoutInput>;
export const WithdrawalRequestCreateWithoutPayoutInputObjectZodSchema = makeSchema();
