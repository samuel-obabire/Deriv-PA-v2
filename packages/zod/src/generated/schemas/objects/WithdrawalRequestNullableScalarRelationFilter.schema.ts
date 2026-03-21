import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { WithdrawalRequestWhereInputObjectSchema as WithdrawalRequestWhereInputObjectSchema } from './WithdrawalRequestWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WithdrawalRequestWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WithdrawalRequestWhereInputObjectSchema).optional().nullable()
}).strict();
export const WithdrawalRequestNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WithdrawalRequestNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WithdrawalRequestNullableScalarRelationFilter>;
export const WithdrawalRequestNullableScalarRelationFilterObjectZodSchema = makeSchema();
