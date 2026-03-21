import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutOrderByWithRelationInputObjectSchema as PayoutOrderByWithRelationInputObjectSchema } from './objects/PayoutOrderByWithRelationInput.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './objects/PayoutWhereInput.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';
import { PayoutCountAggregateInputObjectSchema as PayoutCountAggregateInputObjectSchema } from './objects/PayoutCountAggregateInput.schema';

export const PayoutCountSchema: z.ZodType<Prisma.PayoutCountArgs> = z.object({ orderBy: z.union([PayoutOrderByWithRelationInputObjectSchema, PayoutOrderByWithRelationInputObjectSchema.array()]).optional(), where: PayoutWhereInputObjectSchema.optional(), cursor: PayoutWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PayoutCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.PayoutCountArgs>;

export const PayoutCountZodSchema = z.object({ orderBy: z.union([PayoutOrderByWithRelationInputObjectSchema, PayoutOrderByWithRelationInputObjectSchema.array()]).optional(), where: PayoutWhereInputObjectSchema.optional(), cursor: PayoutWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PayoutCountAggregateInputObjectSchema ]).optional() }).strict();