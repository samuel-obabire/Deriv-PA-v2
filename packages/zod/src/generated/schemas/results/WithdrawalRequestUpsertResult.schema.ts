import * as z from 'zod';
export const WithdrawalRequestUpsertResultSchema = z.object({
  id: z.string(),
  derivId: z.string(),
  amount: z.number(),
  amountNgn: z.number(),
  currency: z.string(),
  derivRef: z.string().optional(),
  createdAt: z.date(),
  status: z.unknown(),
  payout: z.unknown().optional()
});