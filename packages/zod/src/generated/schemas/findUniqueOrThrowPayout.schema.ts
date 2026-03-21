import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutSelectObjectSchema as PayoutSelectObjectSchema } from './objects/PayoutSelect.schema';
import { PayoutIncludeObjectSchema as PayoutIncludeObjectSchema } from './objects/PayoutInclude.schema';
import { PayoutWhereUniqueInputObjectSchema as PayoutWhereUniqueInputObjectSchema } from './objects/PayoutWhereUniqueInput.schema';

export const PayoutFindUniqueOrThrowSchema: z.ZodType<Prisma.PayoutFindUniqueOrThrowArgs> = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), where: PayoutWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PayoutFindUniqueOrThrowArgs>;

export const PayoutFindUniqueOrThrowZodSchema = z.object({ select: PayoutSelectObjectSchema.optional(), include: PayoutIncludeObjectSchema.optional(), where: PayoutWhereUniqueInputObjectSchema }).strict();