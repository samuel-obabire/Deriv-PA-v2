import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema'

const nestedenumpayoutstatusfilterSchema = z.object({
  equals: PayoutStatusSchema.optional(),
  in: PayoutStatusSchema.array().optional(),
  notIn: PayoutStatusSchema.array().optional(),
  not: z.union([PayoutStatusSchema, z.lazy(() => NestedEnumPayoutStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPayoutStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumPayoutStatusFilter> = nestedenumpayoutstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPayoutStatusFilter>;
export const NestedEnumPayoutStatusFilterObjectZodSchema = nestedenumpayoutstatusfilterSchema;
