import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';
import { NestedEnumPayoutStatusWithAggregatesFilterObjectSchema as NestedEnumPayoutStatusWithAggregatesFilterObjectSchema } from './NestedEnumPayoutStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPayoutStatusFilterObjectSchema as NestedEnumPayoutStatusFilterObjectSchema } from './NestedEnumPayoutStatusFilter.schema'

const makeSchema = () => z.object({
  equals: PayoutStatusSchema.optional(),
  in: PayoutStatusSchema.array().optional(),
  notIn: PayoutStatusSchema.array().optional(),
  not: z.union([PayoutStatusSchema, z.lazy(() => NestedEnumPayoutStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPayoutStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPayoutStatusFilterObjectSchema).optional()
}).strict();
export const EnumPayoutStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPayoutStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPayoutStatusWithAggregatesFilter>;
export const EnumPayoutStatusWithAggregatesFilterObjectZodSchema = makeSchema();
