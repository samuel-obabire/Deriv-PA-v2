import type { Prisma } from '../../../../../apps/backend/src/generated/prisma/client';
import * as z from 'zod';
import { WithdrawalRequestCreateManyInputObjectSchema as WithdrawalRequestCreateManyInputObjectSchema } from './objects/WithdrawalRequestCreateManyInput.schema';

export const WithdrawalRequestCreateManySchema: z.ZodType<Prisma.WithdrawalRequestCreateManyArgs> = z.object({ data: z.union([ WithdrawalRequestCreateManyInputObjectSchema, z.array(WithdrawalRequestCreateManyInputObjectSchema) ]),  }).strict() as unknown as z.ZodType<Prisma.WithdrawalRequestCreateManyArgs>;

export const WithdrawalRequestCreateManyZodSchema = z.object({ data: z.union([ WithdrawalRequestCreateManyInputObjectSchema, z.array(WithdrawalRequestCreateManyInputObjectSchema) ]),  }).strict();