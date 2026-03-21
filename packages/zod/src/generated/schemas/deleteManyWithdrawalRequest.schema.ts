import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './objects/WithdrawalRequestWhereInput.schema';

export const WithdrawalRequestDeleteManySchema: z.ZodType<Prisma.WithdrawalRequestDeleteManyArgs> = z.object({ where: WithdrawalRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestDeleteManyArgs>;

export const WithdrawalRequestDeleteManyZodSchema = z.object({ where: WithdrawalRequestWhereInputObjectSchema.optional() }).strict();