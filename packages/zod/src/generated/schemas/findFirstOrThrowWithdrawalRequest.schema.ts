import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './objects/WithdrawalRequestInclude.schema';
import { WithdrawalRequestOrderByWithRelationInputObjectSchema as WithdrawalRequestOrderByWithRelationInputObjectSchema } from './objects/WithdrawalRequestOrderByWithRelationInput.schema';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './objects/WithdrawalRequestWhereInput.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './objects/WithdrawalRequestWhereUniqueInput.schema';
import { WithdrawalRequestScalarFieldEnumSchema } from './enums/WithdrawalRequestScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WithdrawalRequestFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WithdrawalRequestSelect> = z.object({
    id: z.boolean().optional(),
    derivId: z.boolean().optional(),
    amount: z.boolean().optional(),
    amountNgn: z.boolean().optional(),
    currency: z.boolean().optional(),
    derivRef: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    status: z.boolean().optional(),
    payout: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestSelect>;

export const WithdrawalRequestFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    derivId: z.boolean().optional(),
    amount: z.boolean().optional(),
    amountNgn: z.boolean().optional(),
    currency: z.boolean().optional(),
    derivRef: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    status: z.boolean().optional(),
    payout: z.boolean().optional()
  }).strict();

export const WithdrawalRequestFindFirstOrThrowSchema: z.ZodType<Prisma.WithdrawalRequestFindFirstOrThrowArgs> = z.object({ select: WithdrawalRequestFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => WithdrawalRequestIncludeObjectSchema.optional()), orderBy: z.union([WithdrawalRequestOrderByWithRelationInputObjectSchema, WithdrawalRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: WithdrawalRequestWhereInputObjectSchema.optional(), cursor: WithdrawalRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WithdrawalRequestScalarFieldEnumSchema, WithdrawalRequestScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestFindFirstOrThrowArgs>;

export const WithdrawalRequestFindFirstOrThrowZodSchema = z.object({ select: WithdrawalRequestFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => WithdrawalRequestIncludeObjectSchema.optional()), orderBy: z.union([WithdrawalRequestOrderByWithRelationInputObjectSchema, WithdrawalRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: WithdrawalRequestWhereInputObjectSchema.optional(), cursor: WithdrawalRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WithdrawalRequestScalarFieldEnumSchema, WithdrawalRequestScalarFieldEnumSchema.array()]).optional() }).strict();