import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestCreateWithoutPayoutInputObjectSchema as WithdrawalRequestCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedCreateWithoutPayoutInput.schema';
import { WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema as WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateOrConnectWithoutPayoutInput.schema';
import { WithdrawalRequestUpsertWithoutPayoutInputObjectSchema as WithdrawalRequestUpsertWithoutPayoutInputObjectSchema } from './WithdrawalRequestUpsertWithoutPayoutInput.schema';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './WithdrawalRequestWhereInput.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './WithdrawalRequestWhereUniqueInput.schema';
import { WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInputObjectSchema as WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInputObjectSchema } from './WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInput.schema';
import { WithdrawalRequestUpdateWithoutPayoutInputObjectSchema as WithdrawalRequestUpdateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUpdateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedUpdateWithoutPayoutInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WithdrawalRequestCreateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema).optional(),
  upsert: z.lazy(() => WithdrawalRequestUpsertWithoutPayoutInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WithdrawalRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WithdrawalRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WithdrawalRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUpdateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedUpdateWithoutPayoutInputObjectSchema)]).optional()
}).strict();
export const WithdrawalRequestUpdateOneWithoutPayoutNestedInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestUpdateOneWithoutPayoutNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestUpdateOneWithoutPayoutNestedInput>;
export const WithdrawalRequestUpdateOneWithoutPayoutNestedInputObjectZodSchema = makeSchema();
