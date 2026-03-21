import * as z from 'zod';
import { PayoutStatusSchema } from '../enums/PayoutStatus.schema';

export const PayoutSchema = z.object({
  id: z.string(),
  amount: z.number(),
  recipientName: z.string().nullish(),
  recipientAccount: z.string().nullish(),
  reciepientBank: z.string().nullish(),
  createdAt: z.date(),
  withdrawalRequestId: z.string().nullish(),
  status: PayoutStatusSchema.default("UNMATCHED"),
  flagReason: z.string().nullish(),
});

export type PayoutType = z.infer<typeof PayoutSchema>;
