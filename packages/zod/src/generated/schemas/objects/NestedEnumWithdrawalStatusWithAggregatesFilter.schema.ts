import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWithdrawalStatusFilterObjectSchema as NestedEnumWithdrawalStatusFilterObjectSchema } from './NestedEnumWithdrawalStatusFilter.schema'

const nestedenumwithdrawalstatuswithaggregatesfilterSchema = z.object({
  equals: WithdrawalStatusSchema.optional(),
  in: WithdrawalStatusSchema.array().optional(),
  notIn: WithdrawalStatusSchema.array().optional(),
  not: z.union([WithdrawalStatusSchema, z.lazy(() => NestedEnumWithdrawalStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWithdrawalStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWithdrawalStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumWithdrawalStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWithdrawalStatusWithAggregatesFilter> = nestedenumwithdrawalstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWithdrawalStatusWithAggregatesFilter>;
export const NestedEnumWithdrawalStatusWithAggregatesFilterObjectZodSchema = nestedenumwithdrawalstatuswithaggregatesfilterSchema;
