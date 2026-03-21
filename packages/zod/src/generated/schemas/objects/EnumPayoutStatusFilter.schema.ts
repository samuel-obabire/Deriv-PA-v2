import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';
import { NestedEnumPayoutStatusFilterObjectSchema as NestedEnumPayoutStatusFilterObjectSchema } from './NestedEnumPayoutStatusFilter.schema'

const makeSchema = () => z.object({
  equals: PayoutStatusSchema.optional(),
  in: PayoutStatusSchema.array().optional(),
  notIn: PayoutStatusSchema.array().optional(),
  not: z.union([PayoutStatusSchema, z.lazy(() => NestedEnumPayoutStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumPayoutStatusFilterObjectSchema: z.ZodType<Prisma.EnumPayoutStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPayoutStatusFilter>;
export const EnumPayoutStatusFilterObjectZodSchema = makeSchema();
