import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './WithdrawalRequestWhereInput.schema';
import { WithdrawalRequestUpdateWithoutPayoutInputObjectSchema as WithdrawalRequestUpdateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUpdateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedUpdateWithoutPayoutInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WithdrawalRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WithdrawalRequestUpdateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema)])
}).strict();
export const WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInput>;
export const WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInputObjectZodSchema = makeSchema();
