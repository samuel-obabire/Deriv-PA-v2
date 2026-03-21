import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestSelectObjectSchema as WithdrawalRequestSelectObjectSchema } from './WithdrawalRequestSelect.schema';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './WithdrawalRequestInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WithdrawalRequestSelectObjectSchema).optional(),
  include: z.lazy(() => WithdrawalRequestIncludeObjectSchema).optional()
}).strict();
export const WithdrawalRequestArgsObjectSchema = makeSchema();
export const WithdrawalRequestArgsObjectZodSchema = makeSchema();
