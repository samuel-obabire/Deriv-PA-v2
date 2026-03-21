import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './PayoutWhereUniqueInput.schema';
import { PayoutCreateWithoutWithdrawalInputObjectSchema as PayoutCreateWithoutWithdrawalInputObjectSchema } from './PayoutCreateWithoutWithdrawalInput.schema';
import { PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema as PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema } from './PayoutUncheckedCreateWithoutWithdrawalInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PayoutWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PayoutCreateWithoutWithdrawalInputObjectSchema), z.lazy(() => PayoutUncheckedCreateWithoutWithdrawalInputObjectSchema)])
}).strict();
export const PayoutCreateOrConnectWithoutWithdrawalInputObjectSchema: z.ZodType<Prisma.PayoutCreateOrConnectWithoutWithdrawalInput> = makeSchema() as unknown as z.ZodType<Prisma.PayoutCreateOrConnectWithoutWithdrawalInput>;
export const PayoutCreateOrConnectWithoutWithdrawalInputObjectZodSchema = makeSchema();
