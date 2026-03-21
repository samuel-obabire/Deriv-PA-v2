import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema'

const makeSchema = () => z.object({
  set: WithdrawalStatusSchema.optional()
}).strict();
export const EnumWithdrawalStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput>;
export const EnumWithdrawalStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
