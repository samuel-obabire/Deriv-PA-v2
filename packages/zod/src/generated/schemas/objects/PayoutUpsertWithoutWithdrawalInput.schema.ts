import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutUpdateWithoutWithdrawalInputObjectSchema as PayoutUpdateWithoutWithdrawalInputObjectSchema } from './PayoutUpdateWithoutWithdrawalInput.schema';
import { PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema as PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedUpdateWithoutWithdrawalInput.schema';
import { PayoutCreateWithoutWithdrawalInputObjectSchema as PayoutCreateWithoutWithdrawalInputObjectSchema } from './PayoutCreateWithoutWithdrawalInput.schema';
import { PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema as PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedCreateWithoutWithdrawalInput.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './PayoutWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PayoutUpdateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema)]),
  create: z.union([z.lazy(() => PayoutCreateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema)]),
  where: z.lazy(() => PayoutWhereInputObjectSchema).optional()
}).strict();
export const PayoutUpsertWithoutWithdrawalInputObjectSchema: z.ZodType<Prisma.PayoutUpsertWithoutWithdrawalInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutUpsertWithoutWithdrawalInput>;
export const PayoutUpsertWithoutWithdrawalInputObjectZodSchema = makeSchema();
