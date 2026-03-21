import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutCreateWithoutWithdrawalInputObjectSchema as PayoutCreateWithoutWithdrawalInputObjectSchema } from './PayoutCreateWithoutWithdrawalInput.schema';
import { PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema as PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedCreateWithoutWithdrawalInput.schema';
import { PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema as PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema } from './PayoutCreateOrConnectWithoutWithdrawalInput.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './PayoutWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PayoutCreateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema).optional(),
  connect: z.lazy(() => PayoutWhereUniqueInputObjectSchema).optional()
}).strict();
export const PayoutCreateNestedOneWithoutWithdrawalInputObjectSchema: z.ZodType<Prisma.PayoutCreateNestedOneWithoutWithdrawalInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutCreateNestedOneWithoutWithdrawalInput>;
export const PayoutCreateNestedOneWithoutWithdrawalInputObjectZodSchema = makeSchema();
