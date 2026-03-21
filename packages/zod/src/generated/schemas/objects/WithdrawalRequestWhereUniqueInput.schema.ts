import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const WithdrawalRequestWhereUniqueInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestWhereUniqueInput>;
export const WithdrawalRequestWhereUniqueInputObjectZodSchema = makeSchema();
