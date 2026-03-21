import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestArgsObjectSchema as WithdrawalRequestArgsObjectSchema } from './WithdrawalRequestArgs.schema'

const makeSchema = () => z.object({
  withdrawal: z.union([z.boolean(), z.lazy(() => WithdrawalRequestArgsObjectSchema)]).optional()
}).strict();
export const PayoutIncludeObjectSchema: z.ZodType<Prisma.PayoutInclude> = makeSchema() as unknown as z.ZodType<Prisma.PayoutInclude>;
export const PayoutIncludeObjectZodSchema = makeSchema();
