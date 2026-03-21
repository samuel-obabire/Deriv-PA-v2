import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './PayoutWhereInput.schema';
import { PayoutUpdateWithoutWithdrawalInputObjectSchema as PayoutUpdateWithoutWithdrawalInputObjectSchema } from './PayoutUpdateWithoutWithdrawalInput.schema';
import { PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema as PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedUpdateWithoutWithdrawalInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PayoutWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PayoutUpdateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema)])
}).strict();
export const PayoutUpdateToOneWithWhereWithoutWithdrawalInputObjectSchema: z.ZodType<Prisma.PayoutUpdateToOneWithWhereWithoutWithdrawalInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutUpdateToOneWithWhereWithoutWithdrawalInput>;
export const PayoutUpdateToOneWithWhereWithoutWithdrawalInputObjectZodSchema = makeSchema();
