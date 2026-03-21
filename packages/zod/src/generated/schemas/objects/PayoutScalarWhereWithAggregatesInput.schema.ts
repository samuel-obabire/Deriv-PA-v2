import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema as FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumPayoutStatusWithAggregatesFilterObjectSchema as EnumPayoutStatusWithAggregatesFilterObjectSchema } from './EnumPayoutStatusWithAggregatesFilter.schema';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema'

const payoutscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PayoutScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PayoutScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PayoutScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PayoutScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PayoutScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  amount: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  recipientName: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  recipientAccount: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  reciepientBank: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  withdrawalRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumPayoutStatusWithAggregatesFilterObjectSchema), PayoutStatusSchema]).optional(),
  flagReason: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const PayoutScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PayoutScalarWhereWithAggregatesInput> = payoutscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PayoutScalarWhereWithAggregatesInput>;
export const PayoutScalarWhereWithAggregatesInputObjectZodSchema = payoutscalarwherewithaggregatesinputSchema;
