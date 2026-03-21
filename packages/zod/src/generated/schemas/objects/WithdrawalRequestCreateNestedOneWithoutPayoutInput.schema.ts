import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestCreateWithoutPayoutInputObjectSchema as WithdrawalRequestCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateWithoutPayoutInput.schema';
import { WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema as WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema } from './WithdrawalRequestUncheckedCreateWithoutPayoutInput.schema';
import { WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema as WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema } from './WithdrawalRequestCreateOrConnectWithoutPayoutInput.schema';
import { WithdrawalRequestWhereUniqueInputObjectSchema as WithdrawalRequestWhereUniqueInputObjectSchema } from './WithdrawalRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WithdrawalRequestCreateWithoutPayoutInputObjectSchema), z.lazy(() => WithdrawalRequestUncheckedCreateWithoutPayoutInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WithdrawalRequestCreateOrConnectWithoutPayoutInputObjectSchema).optional(),
  connect: z.lazy(() => WithdrawalRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const WithdrawalRequestCreateNestedOneWithoutPayoutInputObjectSchema: z.ZodType<Prisma.WithdrawalRequestCreateNestedOneWithoutPayoutInput> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestCreateNestedOneWithoutPayoutInput>;
export const WithdrawalRequestCreateNestedOneWithoutPayoutInputObjectZodSchema = makeSchema();
