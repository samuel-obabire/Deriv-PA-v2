import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestSelectObjectSchema as WithdrawalRequestSelectObjectSchema } from './objects/WithdrawalRequestSelect.schema';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './objects/WithdrawalRequestInclude.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './objects/WithdrawalRequestWhereUniqueInput.schema';
import { WithdrawalRequestCreateInputObjectSchema as WithdrawalRequestCreateInputObjectSchema } from './objects/WithdrawalRequestCreateInput.schema';
import { WithdrawalRequestUncheckedCreateInputObjectSchema as WithdrawalRequestUncheckedCreateInputObjectSchema } from './objects/WithdrawalRequestUncheckedCreateInput.schema';
import { WithdrawalRequestUpdateInputObjectSchema as WithdrawalRequestUpdateInputObjectSchema } from './objects/WithdrawalRequestUpdateInput.schema';
import { WithdrawalRequestUncheckedUpdateInputObjectSchema as WithdrawalRequestUncheckedUpdateInputObjectSchema } from './objects/WithdrawalRequestUncheckedUpdateInput.schema';

export const WithdrawalRequestUpsertOneSchema: z.ZodType<Prisma.WithdrawalRequestUpsertArgs> = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), where: WithdrawalRequestWhereUniqueInputObjectSchema, create: z.union([ WithdrawalRequestCreateInputObjectSchema, WithdrawalRequestUncheckedCreateInputObjectSchema ]), update: z.union([ WithdrawalRequestUpdateInputObjectSchema, WithdrawalRequestUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestUpsertArgs>;

export const WithdrawalRequestUpsertOneZodSchema = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), where: WithdrawalRequestWhereUniqueInputObjectSchema, create: z.union([ WithdrawalRequestCreateInputObjectSchema, WithdrawalRequestUncheckedCreateInputObjectSchema ]), update: z.union([ WithdrawalRequestUpdateInputObjectSchema, WithdrawalRequestUncheckedUpdateInputObjectSchema ]) }).strict();