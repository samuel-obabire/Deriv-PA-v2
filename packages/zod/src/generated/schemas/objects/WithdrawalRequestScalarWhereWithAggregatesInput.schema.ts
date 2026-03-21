import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema as FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumWithdrawalStatusWithAggregatesFilterObjectSchema as EnumWithdrawalStatusWithAggregatesFilterObjectSchema } from './EnumWithdrawalStatusWithAggregatesFilter.schema';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema'

const withdrawalrequestscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WithdrawalRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WithdrawalRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WithdrawalRequestScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WithdrawalRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WithdrawalRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  derivId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  amount: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  amountNgn: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  derivRef: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  status: z.union([z.lazy(() => EnumWithdrawalStatusWithAggregatesFilterObjectSchema), WithdrawalStatusSchema]).optional()
}).strict();
export const WithdrawalRequestScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestScalarWhereWithAggregatesInput> = withdrawalrequestscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WithdrawalRequestScalarWhereWithAggregatesInput>;
export const WithdrawalRequestScalarWhereWithAggregatesInputObjectZodSchema = withdrawalrequestscalarwherewithaggregatesinputSchema;
