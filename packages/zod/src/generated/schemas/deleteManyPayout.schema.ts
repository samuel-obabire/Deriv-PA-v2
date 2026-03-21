import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './objects/PayoutWhereInput.schema';

export const PayoutDeleteManySchema: z.ZodType<Prisma.PayoutDeleteManyArgs> = z.object({ where: PayoutWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PayoutDeleteManyArgs>;

export const PayoutDeleteManyZodSchema = z.object({ where: PayoutWhereInputObjectSchema.optional() }).strict();