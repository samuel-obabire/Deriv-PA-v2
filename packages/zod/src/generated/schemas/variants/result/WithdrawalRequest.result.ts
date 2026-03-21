import * as z from 'zod';
import { WithdrawalStatusSchema } from '../../enums/WithdrawalStatus.schema';
// prettier-ignore
export const WithdrawalRequestResultSchema = z.object({
    id: z.string(),
    derivId: z.string(),
    amount: z.number(),
    amountNgn: z.number(),
    currency: z.string(),
    derivRef: z.string().nullable(),
    createdAt: z.date(),
    status: WithdrawalStatusSchema,
    payout: z.unknown().nullable()
}).strict();

export type WithdrawalRequestResultType = z.infer<typeof WithdrawalRequestResultSchema>;
