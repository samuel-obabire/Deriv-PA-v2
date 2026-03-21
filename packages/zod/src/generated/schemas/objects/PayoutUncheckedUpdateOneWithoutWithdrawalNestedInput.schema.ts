import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutCreateWithoutWithdrawalInputObjectSchema as PayoutCreateWithoutWithdrawalInputObjectSchema } from './PayoutCreateWithoutWithdrawalInput.schema';
import { PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema as PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedCreateWithoutWithdrawalInput.schema';
import { PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema as PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema } from './PayoutCreateOrConnectWithoutWithdrawalInput.schema';
import { PayoutUpsertWithoutWithdrawalInputObjectSchema as PayoutUpsertWithoutWithdrawalInputObjectSchema } from './PayoutUpsertWithoutWithdrawalInput.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './PayoutWhereInput.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './PayoutWhereUniqueInput.schema';
import { PayoutUpdateToOneWithWhereWithoutWithdrawalInputObjectSchema as PayoutUpdateToOneWithWhereWithoutWithdrawalInputObjectSchema } from './PayoutUpdateToOneWithWhereWithoutWithdrawalInput.schema';
import { PayoutUpdateWithoutWithdrawalInputObjectSchema as PayoutUpdateWithoutWithdrawalInputObjectSchema } from './PayoutUpdateWithoutWithdrawalInput.schema';
import { PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema as PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedUpdateWithoutWithdrawalInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PayoutCreateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema).optional(),
  upsert: z.lazy(() => PayoutUpsertWithoutWithdrawalInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => PayoutWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => PayoutWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => PayoutWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PayoutUpdateToOneWithWhereWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUpdateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedUpdateWithoutWithdrawalInputObjectSchema)]).optional()
}).strict();
export const PayoutUncheckedUpdateOneWithoutWithdrawalNestedInputObjectSchema: z.ZodType<Prisma.PayoutUncheckedUpdateOneWithoutWithdrawalNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutUncheckedUpdateOneWithoutWithdrawalNestedInput>;
export const PayoutUncheckedUpdateOneWithoutWithdrawalNestedInputObjectZodSchema = makeSchema();
