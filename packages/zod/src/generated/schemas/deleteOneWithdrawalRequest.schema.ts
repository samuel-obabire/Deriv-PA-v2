import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestSelectObjectSchema as WithdrawalRequestSelectObjectSchema } from './objects/WithdrawalRequestSelect.schema';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './objects/WithdrawalRequestInclude.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './objects/WithdrawalRequestWhereUniqueInput.schema';

export const WithdrawalRequestDeleteOneSchema: z.ZodType<Prisma.WithdrawalRequestDeleteArgs> = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), where: WithdrawalRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestDeleteArgs>;

export const WithdrawalRequestDeleteOneZodSchema = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), where: WithdrawalRequestWhereUniqueInputObjectSchema }).strict();