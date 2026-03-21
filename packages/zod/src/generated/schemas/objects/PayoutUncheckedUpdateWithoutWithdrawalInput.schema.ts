import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';
import { EnumPayoutStatusFieldUpdateOperationsInputObjectSchema as EnumPayoutStatusFieldUpdateOperationsInputObjectSchema } from './EnumPayoutStatusFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  amount: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  recipientName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  recipientAccount: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  reciepientBank: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([PayoutStatusSchema, z.lazy(() => EnumPayoutStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  flagReason: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable()
}).strict();
export const PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema: z.ZodType<Prisma.PayoutUncheckedUpdateWithoutWithdrawalInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutUncheckedUpdateWithoutWithdrawalInput>;
export const PayoutUncheckedUpdateWithoutWithdrawalInputObjectZodSchema = makeSchema();
