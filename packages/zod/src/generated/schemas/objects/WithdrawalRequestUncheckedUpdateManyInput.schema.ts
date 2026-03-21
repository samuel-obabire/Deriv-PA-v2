import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';
import { EnumWithdrawalStatusFieldUpdateOperationsInputObjectSchema as EnumWithdrawalStatusFieldUpdateOperationsInputObjectSchema } from './EnumWithdrawalStatusFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  derivId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  amount: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  amountNgn: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  currency: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  derivRef: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([WithdrawalStatusSchema, z.lazy(() => EnumWithdrawalStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const WithdrawalRequestUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestUncheckedUpdateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestUncheckedUpdateManyInput>;
export const WithdrawalRequestUncheckedUpdateManyInputObjectZodSchema = makeSchema();
