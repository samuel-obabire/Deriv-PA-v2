import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPayoutStatusFilterObjectSchema as NestedEnumPayoutStatusFilterObjectSchema } from './NestedEnumPayoutStatusFilter.schema'

const nestedenumpayoutstatuswithaggregatesfilterSchema = z.object({
  equals: PayoutStatusSchema.optional(),
  in: PayoutStatusSchema.array().optional(),
  notIn: PayoutStatusSchema.array().optional(),
  not: z.union([PayoutStatusSchema, z.lazy(() => NestedEnumPayoutStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPayoutStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPayoutStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumPayoutStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPayoutStatusWithAggregatesFilter> = nestedenumpayoutstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPayoutStatusWithAggregatesFilter>;
export const NestedEnumPayoutStatusWithAggregatesFilterObjectZodSchema = nestedenumpayoutstatuswithaggregatesfilterSchema;
