import * as z from 'zod';
import type { Prisma } from '../../../../../../apps/backend/src/generated/prisma/client';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './PayoutWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PayoutWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => PayoutWhereInputObjectSchema).optional().nullable()
}).strict();
export const PayoutNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.PayoutNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PayoutNullableScalarRelationFilter>;
export const PayoutNullableScalarRelationFilterObjectZodSchema = makeSchema();
