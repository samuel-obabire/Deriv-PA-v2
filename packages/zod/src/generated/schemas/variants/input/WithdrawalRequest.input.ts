import * as z from 'zod';
import { WithdrawalStatusSchema } from '../../enums/WithdrawalStatus.schema';
// prettier-ignore
export const WithdrawalRequestInputSchema = z.object({
    id: z.string(),
    derivId: z.string(),
    amount: z.number(),
    amountNgn: z.number(),
    currency: z.string(),
    derivRef: z.string().optional().nullable(),
    createdAt: z.date(),
    status: WithdrawalStatusSchema,
    payout: z.unknown().optional().nullable()
}).strict();

export type WithdrawalRequestInputType = z.infer<typeof WithdrawalRequestInputSchema>;
