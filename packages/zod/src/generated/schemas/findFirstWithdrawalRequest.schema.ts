import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestIncludeObjectSchema as WithdrawalRequestIncludeObjectSchema } from './objects/WithdrawalRequestInclude.schema';
import { WithdrawalRequestOrderByWithRelationInputObjectSchema as WithdrawalRequestOrderByWithRelationInputObjectSchema } from './objects/WithdrawalRequestOrderByWithRelationInput.schema';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './objects/WithdrawalRequestWhereInput.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './objects/WithdrawalRequestWhereUniqueInput.schema';
import { WithdrawalRequestScalarFieldEnumSchema } from './enums/WithdrawalRequestScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WithdrawalRequestFindFirstSelectSchema: z.ZodType<Prisma.WithdrawalRequestSelect> = z.object({
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

export const WithdrawalRequestFindFirstSelectZodSchema = z.object({
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

export const WithdrawalRequestFindFirstSchema: z.ZodType<Prisma.WithdrawalRequestFindFirstArgs> = z.object({ select: WithdrawalRequestFindFirstSelectSchema.optional(), include: z.lazy(() => WithdrawalRequestIncludeObjectSchema.optional()), orderBy: z.union([WithdrawalRequestOrderByWithRelationInputObjectSchema, WithdrawalRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: WithdrawalRequestWhereInputObjectSchema.optional(), cursor: WithdrawalRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WithdrawalRequestScalarFieldEnumSchema, WithdrawalRequestScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestFindFirstArgs>;

export const WithdrawalRequestFindFirstZodSchema = z.object({ select: WithdrawalRequestFindFirstSelectSchema.optional(), include: z.lazy(() => WithdrawalRequestIncludeObjectSchema.optional()), orderBy: z.union([WithdrawalRequestOrderByWithRelationInputObjectSchema, WithdrawalRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: WithdrawalRequestWhereInputObjectSchema.optional(), cursor: WithdrawalRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WithdrawalRequestScalarFieldEnumSchema, WithdrawalRequestScalarFieldEnumSchema.array()]).optional() }).strict();