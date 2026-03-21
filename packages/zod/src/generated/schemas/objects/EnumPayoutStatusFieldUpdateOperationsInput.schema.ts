import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema'

const makeSchema = () => z.object({
  set: PayoutStatusSchema.optional()
}).strict();
export const EnumPayoutStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPayoutStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumPayoutStatusFieldUpdateOperationsInput>;
export const EnumPayoutStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
