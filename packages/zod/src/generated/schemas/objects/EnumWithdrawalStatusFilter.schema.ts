import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';
import { NestedEnumWithdrawalStatusFilterObjectSchema as NestedEnumWithdrawalStatusFilterObjectSchema } from './NestedEnumWithdrawalStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WithdrawalStatusSchema.optional(),
  in: WithdrawalStatusSchema.array().optional(),
  notIn: WithdrawalStatusSchema.array().optional(),
  not: z.union([WithdrawalStatusSchema, z.lazy(() => NestedEnumWithdrawalStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumWithdrawalStatusFilterObjectSchema: z.ZodType<Prisma.EnumWithdrawalStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWithdrawalStatusFilter>;
export const EnumWithdrawalStatusFilterObjectZodSchema = makeSchema();
