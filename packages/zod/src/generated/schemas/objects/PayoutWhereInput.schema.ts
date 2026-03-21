import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumPayoutStatusFilterObjectSchema as EnumPayoutStatusFilterObjectSchema } from './EnumPayoutStatusFilter.schema';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';
import { WithdrawalRequestNullableScalarRelationFilterObjectSchema as WithdrawalRequestNullableScalarRelationFilterObjectSchema } from './WithdrawalRequestNullableScalarRelationFilter.schema';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './WithdrawalRequestWhereInput.schema'

const payoutwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PayoutWhereInputObjectSchema), z.lazy(() => PayoutWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PayoutWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PayoutWhereInputObjectSchema), z.lazy(() => PayoutWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  amount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  recipientName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  recipientAccount: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reciepientBank: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  withdrawalRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumPayoutStatusFilterObjectSchema), PayoutStatusSchema]).optional(),
  flagReason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  withdrawal: z.union([z.lazy(() => WithdrawalRequestNullableScalarRelationFilterObjectSchema), z.lazy(() => WithdrawalRequestWhereInputObjectSchema)]).optional()
}).strict();
export const PayoutWhereInputObjectSchema: z.ZodType<Prisma.PayoutWhereInput> = payoutwhereinputSchema as unknown as z.ZodType<Prisma.PayoutWhereInput>;
export const PayoutWhereInputObjectZodSchema = payoutwhereinputSchema;
