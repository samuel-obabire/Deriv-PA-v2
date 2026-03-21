import * as z from 'zod';
import { PayoutStatusSchema } from '../../enums/PayoutStatus.schema';
// prettier-ignore
export const PayoutInputSchema = z.object({
    id: z.string(),
    amount: z.number(),
    recipientName: z.string().optional().nullable(),
    recipientAccount: z.string().optional().nullable(),
    reciepientBank: z.string().optional().nullable(),
    createdAt: z.date(),
    withdrawalRequestId: z.string().optional().nullable(),
    withdrawal: z.unknown().optional().nullable(),
    status: PayoutStatusSchema,
    flagReason: z.string().optional().nullable()
}).strict();

export type PayoutInputType = z.infer<typeof PayoutInputSchema>;
