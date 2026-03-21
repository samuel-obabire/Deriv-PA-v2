import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutArgsObjectSchema as PayoutArgsObjectSchema } from './PayoutArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  derivId: z.boolean().optional(),
  amount: z.boolean().optional(),
  amountNgn: z.boolean().optional(),
  currency: z.boolean().optional(),
  derivRef: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  status: z.boolean().optional(),
  payout: z.union([z.boolean(), z.lazy(() => PayoutArgsObjectSchema)]).optional()
}).strict();
export const WithdrawalRequestSelectObjectSchema: z.ZodType<Prisma.WithdrawalRequestSelect> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestSelect>;
export const WithdrawalRequestSelectObjectZodSchema = makeSchema();
