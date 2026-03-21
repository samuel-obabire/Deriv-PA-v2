import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutSelectObjectSchema as PayoutSelectObjectSchema } from './objects/PayoutSelect.schema';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './objects/PayoutInclude.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';

export const PayoutFindUniqueSchema: z.ZodType<Prisma.PayoutFindUniqueArgs> = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), where: PayoutWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PayoutFindUniqueArgs>;

export const PayoutFindUniqueZodSchema = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), where: PayoutWhereUniqueInputObjectSchema }).strict();