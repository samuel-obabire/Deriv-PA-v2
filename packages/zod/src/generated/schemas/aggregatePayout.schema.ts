import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutOrderByWithRelationInputObjectSchema as PayoutOrderByWithRelationInputObjectSchema } from './objects/PayoutOrderByWithRelationInput.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './objects/PayoutWhereInput.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';
import { PayoutCountAggregateInputObjectSchema as PayoutCountAggregateInputObjectSchema } from './objects/PayoutCountAggregateInput.schema';
import { PayoutMinAggregateInputObjectSchema as PayoutMinAggregateInputObjectSchema } from './objects/PayoutMinAggregateInput.schema';
import { PayoutMaxAggregateInputObjectSchema as PayoutMaxAggregateInputObjectSchema } from './objects/PayoutMaxAggregateInput.schema';
import { PayoutAvgAggregateInputObjectSchema as PayoutAvgAggregateInputObjectSchema } from './objects/PayoutAvgAggregateInput.schema';
import { PayoutSumAggregateInputObjectSchema as PayoutSumAggregateInputObjectSchema } from './objects/PayoutSumAggregateInput.schema';

export const PayoutAggregateSchema: z.ZodType<Prisma.PayoutAggregateArgs> = z.object({ orderBy: z.union([PayoutOrderByWithRelationInputObjectSchema, PayoutOrderByWithRelationInputObjectSchema.array()]).optional(), where: PayoutWhereInputObjectSchema.optional(), cursor: PayoutWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), PayoutCountAggregateInputObjectSchema ]).optional(), _min: PayoutMinAggregateInputObjectSchema.optional(), _max: PayoutMaxAggregateInputObjectSchema.optional(), _avg: PayoutAvgAggregateInputObjectSchema.optional(), _sum: PayoutSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PayoutAggregateArgs>;

export const PayoutAggregateZodSchema = z.object({ orderBy: z.union([PayoutOrderByWithRelationInputObjectSchema, PayoutOrderByWithRelationInputObjectSchema.array()]).optional(), where: PayoutWhereInputObjectSchema.optional(), cursor: PayoutWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), PayoutCountAggregateInputObjectSchema ]).optional(), _min: PayoutMinAggregateInputObjectSchema.optional(), _max: PayoutMaxAggregateInputObjectSchema.optional(), _avg: PayoutAvgAggregateInputObjectSchema.optional(), _sum: PayoutSumAggregateInputObjectSchema.optional() }).strict();