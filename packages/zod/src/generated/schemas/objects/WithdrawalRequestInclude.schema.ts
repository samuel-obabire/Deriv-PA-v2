import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutArgsObjectSchema as PayoutArgsObjectSchema } from './PayoutArgs.schema'

const makeSchema = () => z.object({
  payout: z.union([z.boolean(), z.lazy(() => PayoutArgsObjectSchema)]).optional()
}).strict();
export const WithdrawalRequestIncludeObjectSchema: z.ZodType<Prisma.WithdrawalRequestInclude> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestInclude>;
export const WithdrawalRequestIncludeObjectZodSchema = makeSchema();
