import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema'

const nestedenumwithdrawalstatusfilterSchema = z.object({
  equals: WithdrawalStatusSchema.optional(),
  in: WithdrawalStatusSchema.array().optional(),
  notIn: WithdrawalStatusSchema.array().optional(),
  not: z.union([WithdrawalStatusSchema, z.lazy(() => NestedEnumWithdrawalStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWithdrawalStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumWithdrawalStatusFilter> = nestedenumwithdrawalstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWithdrawalStatusFilter>;
export const NestedEnumWithdrawalStatusFilterObjectZodSchema = nestedenumwithdrawalstatusfilterSchema;
