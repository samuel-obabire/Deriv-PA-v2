import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestSelectObjectSchema as WithdrawalRequestSelectObjectSchema } from './objects/WithdrawalRequestSelect.schema';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './objects/WithdrawalRequestInclude.schema';
import { WithdrawalRequestCreateInputObjectSchema as WithdrawalRequestCreateInputObjectSchema } from './objects/WithdrawalRequestCreateInput.schema';
import { WithdrawalRequestUncheckedCreateInputObjectSchema as WithdrawalRequestUncheckedCreateInputObjectSchema } from './objects/WithdrawalRequestUncheckedCreateInput.schema';

export const WithdrawalRequestCreateOneSchema: z.ZodType<Prisma.WithdrawalRequestCreateArgs> = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), data: z.union([WithdrawalRequestCreateInputObjectSchema, WithdrawalRequestUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestCreateArgs>;

export const WithdrawalRequestCreateOneZodSchema = z.object({ select: WithdrawalRequestSelectObjectSchema.optional(), include: WithdrawalRequestIncludeObjectSchema.optional(), data: z.union([WithdrawalRequestCreateInputObjectSchema, WithdrawalRequestUncheckedCreateInputObjectSchema]) }).strict();