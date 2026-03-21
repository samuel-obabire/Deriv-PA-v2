import * as z from 'zod';
export const PayoutUpsertResultSchema = z.object({
  id: z.string(),
  amount: z.number(),
  recipientName: z.string().optional(),
  recipientAccount: z.string().optional(),
  reciepientBank: z.string().optional(),
  createdAt: z.date(),
  withdrawalRequestId: z.string().optional(),
  withdrawal: z.unknown().optional(),
  status: z.unknown(),
  flagReason: z.string().optional()
});