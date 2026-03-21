import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './objects/PayoutInclude.schema';
import { PayoutOrderByWithRelationInputObjectSchema as PayoutOrderByWithRelationInputObjectSchema } from './objects/PayoutOrderByWithRelationInput.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './objects/PayoutWhereInput.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';
import { PayoutScalarFieldEnumSchema } from './enums/PayoutScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PayoutFindManySelectSchema: z.ZodType<Prisma.PayoutSelect> = z.object({
    id: z.boolean().optional(),
    amount: z.boolean().optional(),
    recipientName: z.boolean().optional(),
    recipientAccount: z.boolean().optional(),
    reciepientBank: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    withdrawalRequestId: z.boolean().optional(),
    withdrawal: z.boolean().optional(),
    status: z.boolean().optional(),
    flagReason: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PayoutSelect>;

export const PayoutFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    amount: z.boolean().optional(),
    recipientName: z.boolean().optional(),
    recipientAccount: z.boolean().optional(),
    reciepientBank: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    withdrawalRequestId: z.boolean().optional(),
    withdrawal: z.boolean().optional(),
    status: z.boolean().optional(),
    flagReason: z.boolean().optional()
  }).strict();

export const PayoutFindManySchema: z.ZodType<Prisma.PayoutFindManyArgs> = z.object({ select: PayoutFindManySelectSchema.optional(), include: z.lazy(() => PayoutIncludeObjectSchema.optional()), orderBy: z.union([PayoutOrderByWithRelationInputObjectSchema, PayoutOrderByWithRelationInputObjectSchema.array()]).optional(), where: PayoutWhereInputObjectSchema.optional(), cursor: PayoutWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PayoutScalarFieldEnumSchema, PayoutScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PayoutFindManyArgs>;

export const PayoutFindManyZodSchema = z.object({ select: PayoutFindManySelectSchema.optional(), include: z.lazy(() => PayoutIncludeObjectSchema.optional()), orderBy: z.union([PayoutOrderByWithRelationInputObjectSchema, PayoutOrderByWithRelationInputObjectSchema.array()]).optional(), where: PayoutWhereInputObjectSchema.optional(), cursor: PayoutWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PayoutScalarFieldEnumSchema, PayoutScalarFieldEnumSchema.array()]).optional() }).strict();