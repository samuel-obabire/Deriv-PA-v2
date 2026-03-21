import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestUpdateManyMutationInputObjectSchema as WithdrawalRequestUpdateManyMutationInputObjectSchema } from './objects/WithdrawalRequestUpdateManyMutationInput.schema';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './objects/WithdrawalRequestWhereInput.schema';

export const WithdrawalRequestUpdateManySchema: z.ZodType<Prisma.WithdrawalRequestUpdateManyArgs> = z.object({ data: WithdrawalRequestUpdateManyMutationInputObjectSchema, where: WithdrawalRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestUpdateManyArgs>;

export const WithdrawalRequestUpdateManyZodSchema = z.object({ data: WithdrawalRequestUpdateManyMutationInputObjectSchema, where: WithdrawalRequestWhereInputObjectSchema.optional() }).strict();