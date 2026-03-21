import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';
import { NestedEnumWithdrawalStatusWithAggregatesFilterObjectSchema as NestedEnumWithdrawalStatusWithAggregatesFilterObjectSchema } from './NestedEnumWithdrawalStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWithdrawalStatusFilterObjectSchema as NestedEnumWithdrawalStatusFilterObjectSchema } from './NestedEnumWithdrawalStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WithdrawalStatusSchema.optional(),
  in: WithdrawalStatusSchema.array().optional(),
  notIn: WithdrawalStatusSchema.array().optional(),
  not: z.union([WithdrawalStatusSchema, z.lazy(() => NestedEnumWithdrawalStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWithdrawalStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWithdrawalStatusFilterObjectSchema).optional()
}).strict();
export const EnumWithdrawalStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWithdrawalStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWithdrawalStatusWithAggregatesFilter>;
export const EnumWithdrawalStatusWithAggregatesFilterObjectZodSchema = makeSchema();
