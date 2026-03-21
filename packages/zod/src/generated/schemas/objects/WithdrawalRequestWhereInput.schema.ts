import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumWithdrawalStatusFilterObjectSchema as EnumWithdrawalStatusFilterObjectSchema } from './EnumWithdrawalStatusFilter.schema';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';
import { PayoutNullableScalarRelationFilterObjectSchema as PayoutNullableScalarRelationFilterObjectSchema } from './PayoutNullableScalarRelationFilter.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './PayoutWhereInput.schema'

const withdrawalrequestwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WithdrawalRequestWhereInputObjectSchema), z.lazy(() => WithdrawalRequestWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WithdrawalRequestWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WithdrawalRequestWhereInputObjectSchema), z.lazy(() => WithdrawalRequestWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  derivId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  amount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  amountNgn: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  derivRef: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  status: z.union([z.lazy(() => EnumWithdrawalStatusFilterObjectSchema), WithdrawalStatusSchema]).optional(),
  payout: z.union([z.lazy(() => PayoutNullableScalarRelationFilterObjectSchema), z.lazy(() => PayoutWhereInputObjectSchema)]).optional()
}).strict();
export const WithdrawalRequestWhereInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestWhereInput> = withdrawalrequestwhereinputSchema as unknown as z.ZodType<Prisma.WithdrawalRequestWhereInput>;
export const WithdrawalRequestWhereInputObjectZodSchema = withdrawalrequestwhereinputSchema;
