import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestUpdateWithoutPayoutInputObjectSchema as WithdrawalRequestUpdateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUpdateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedUpdateWithoutPayoutInput.schema';
import { WithdrawalRequestCreateWithoutPayoutInputObjectSchema as WithdrawalRequestCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedCreateWithoutPayoutInput.schema';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './WithdrawalRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WithdrawalRequestUpdateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema)]),
  create: z.union([z.lazy(() => WithdrawalRequestCreateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema)]),
  where: z.lazy(() => WithdrawalRequestWhereInputObjectSchema).optional()
}).strict();
export const WithdrawalRequestUpsertWithoutPayoutInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestUpsertWithoutPayoutInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestUpsertWithoutPayoutInput>;
export const WithdrawalRequestUpsertWithoutPayoutInputObjectZodSchema = makeSchema();
