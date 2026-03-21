import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  withdrawalRequestId: z.string().optional()
}).strict();
export const PayoutWhereUniqueInputObjectSchema: z.ZodType<Prisma.PayoutWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutWhereUniqueInput>;
export const PayoutWhereUniqueInputObjectZodSchema = makeSchema();
