import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { PayoutCreateManyInputObjectSchema as PayoutCreateManyInputObjectSchema } from './objects/PayoutCreateManyInput.schema';

export const PayoutCreateManySchema: z.ZodType<Prisma.PayoutCreateManyArgs> = z.object({ data: z.union([ PayoutCreateManyInputObjectSchema, z.array(PayoutCreateManyInputObjectSchema) ]),  }).strict() as unknown as z.ZodType<Prisma.PayoutCreateManyArgs>;

export const PayoutCreateManyZodSchema = z.object({ data: z.union([ PayoutCreateManyInputObjectSchema, z.array(PayoutCreateManyInputObjectSchema) ]),  }).strict();