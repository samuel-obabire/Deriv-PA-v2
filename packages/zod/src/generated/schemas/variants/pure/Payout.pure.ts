import * as z from 'zod';
import { PayoutStatusSchema } from '../../enums/PayoutStatus.schema';
// prettier-ignore
export const PayoutModelSchema = z.object({
    id: z.string(),
    amount: z.number(),
    recipientName: z.string().nullable(),
    recipientAccount: z.string().nullable(),
    reciepientBank: z.string().nullable(),
    createdAt: z.date(),
    withdrawalRequestId: z.string().nullable(),
    withdrawal: z.unknown().nullable(),
    status: PayoutStatusSchema,
    flagReason: z.string().nullable()
}).strict();

export type PayoutPureType = z.infer<typeof PayoutModelSchema>;
