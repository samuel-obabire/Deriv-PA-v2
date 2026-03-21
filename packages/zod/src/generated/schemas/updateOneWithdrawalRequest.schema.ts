import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestSelectObjectSchema as WithdrawalRequestSelectObjectSchema } from './objects/WithdrawalRequestSelect.schema';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './objects/WithdrawalRequestInclude.schema';
import { WithdrawalRequestUpdateInputObjectSchema as WithdrawalRequestUpdateInputObjectSchema } from './objects/WithdrawalRequestUpdateInput.schema';
import { WithdrawalRequestUncheckedUpdateInputObjectSchema as WithdrawalRequestUncheckedUpdateInputObjectSchema } from './objects/WithdrawalRequestUncheckedUpdateInput.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './objects/WithdrawalRequestWhereUniqueInput.schema';

export const WithdrawalRequestUpdateOneSchema: z.ZodType<Prisma.WithdrawalRequestUpdateArgs> = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), data: z.union([WithdrawalRequestUpdateInputObjectSchema, WithdrawalRequestUncheckedUpdateInputObjectSchema]), where: WithdrawalRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestUpdateArgs>;

export const WithdrawalRequestUpdateOneZodSchema = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), data: z.union([WithdrawalRequestUpdateInputObjectSchema, WithdrawalRequestUncheckedUpdateInputObjectSchema]), where: WithdrawalRequestWhereUniqueInputObjectSchema }).strict();