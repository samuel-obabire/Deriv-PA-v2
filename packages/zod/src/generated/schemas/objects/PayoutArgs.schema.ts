import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutSelectObjectSchema as PayoutSelectObjectSchema } from './PayoutSelect.schema';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './PayoutInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PayoutSelectObjectSchema).optional(),
  include: z.lazy(() => PayoutIncludeObjectSchema).optional()
}).strict();
export const PayoutArgsObjectSchema = makeSchema();
export const PayoutArgsObjectZodSchema = makeSchema();
