import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutUpdateManyMutationInputObjectSchema as PayoutUpdateManyMutationInputObjectSchema } from './objects/PayoutUpdateManyMutationInput.schema';
import { PayoutWhereInputObjectSchema as PayoutWhereInputObjectSchema } from './objects/PayoutWhereInput.schema';

export const PayoutUpdateManySchema: z.ZodType<Prisma.PayoutUpdateManyArgs> = z.object({ data: PayoutUpdateManyMutationInputObjectSchema, where: PayoutWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PayoutUpdateManyArgs>;

export const PayoutUpdateManyZodSchema = z.object({ data: PayoutUpdateManyMutationInputObjectSchema, where: PayoutWhereInputObjectSchema.optional() }).strict();