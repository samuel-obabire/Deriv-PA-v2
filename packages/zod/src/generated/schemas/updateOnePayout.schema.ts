import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutSelectObjectSchema as PayoutSelectObjectSchema } from './objects/PayoutSelect.schema';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './objects/PayoutInclude.schema';
import { PayoutUpdateInputObjectSchema as PayoutUpdateInputObjectSchema } from './objects/PayoutUpdateInput.schema';
import { PayoutUncheckedUpdateInputObjectSchema as PayoutUncheckedUpdateInputObjectSchema } from './objects/PayoutUncheckedUpdateInput.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';

export const PayoutUpdateOneSchema: z.ZodType<Prisma.PayoutUpdateArgs> = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), data: z.union([PayoutUpdateInputObjectSchema, PayoutUncheckedUpdateInputObjectSchema]), where: PayoutWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PayoutUpdateArgs>;

export const PayoutUpdateOneZodSchema = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), data: z.union([PayoutUpdateInputObjectSchema, PayoutUncheckedUpdateInputObjectSchema]), where: PayoutWhereUniqueInputObjectSchema }).strict();