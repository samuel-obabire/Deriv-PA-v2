import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './WithdrawalRequestWhereUniqueInput.schema';
import { WithdrawalRequestCreateWithoutPayoutInputObjectSchema as WithdrawalRequestCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedCreateWithoutPayoutInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WithdrawalRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WithdrawalRequestCreateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema)])
}).strict();
export const WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestCreateOrConnectWithoutPayoutInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestCreateOrConnectWithoutPayoutInput>;
export const WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectZodSchema = makeSchema();
