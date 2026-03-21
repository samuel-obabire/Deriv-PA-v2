import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutSelectObjectSchema as PayoutSelectObjectSchema } from './objects/PayoutSelect.schema';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './objects/PayoutInclude.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';
import { PayoutCreateInputObjectSchema as PayoutCreateInputObjectSchema } from './objects/PayoutCreateInput.schema';
import { PayoutUncheckedCreateInputObjectSchema as PayoutUncheckedCreateInputObjectSchema } from './objects/PayoutUncheckedCreateInput.schema';
import { PayoutUpdateInputObjectSchema as PayoutUpdateInputObjectSchema } from './objects/PayoutUpdateInput.schema';
import { PayoutUncheckedUpdateInputObjectSchema as PayoutUncheckedUpdateInputObjectSchema } from './objects/PayoutUncheckedUpdateInput.schema';

export const PayoutUpsertOneSchema: z.ZodType<Prisma.PayoutUpsertArgs> = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), where: PayoutWhereUniqueInputObjectSchema, create: z.union([ PayoutCreateInputObjectSchema, PayoutUncheckedCreateInputObjectSchema ]), update: z.union([ PayoutUpdateInputObjectSchema, PayoutUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.PayoutUpsertArgs>;

export const PayoutUpsertOneZodSchema = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), where: PayoutWhereUniqueInputObjectSchema, create: z.union([ PayoutCreateInputObjectSchema, PayoutUncheckedCreateInputObjectSchema ]), update: z.union([ PayoutUpdateInputObjectSchema, PayoutUncheckedUpdateInputObjectSchema ]) }).strict();