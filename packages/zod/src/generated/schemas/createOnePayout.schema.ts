import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutSelectObjectSchema as PayoutSelectObjectSchema } from './objects/PayoutSelect.schema';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './objects/PayoutInclude.schema';
import { PayoutCreateInputObjectSchema as PayoutCreateInputObjectSchema } from './objects/PayoutCreateInput.schema';
import { PayoutUncheckedCreateInputObjectSchema as PayoutUncheckedCreateInputObjectSchema } from './objects/PayoutUncheckedCreateInput.schema';

export const PayoutCreateOneSchema: z.ZodType<Prisma.PayoutCreateArgs> = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), data: z.union([PayoutCreateInputObjectSchema, PayoutUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PayoutCreateArgs>;

export const PayoutCreateOneZodSchema = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), data: z.union([PayoutCreateInputObjectSchema, PayoutUncheckedCreateInputObjectSchema]) }).strict();