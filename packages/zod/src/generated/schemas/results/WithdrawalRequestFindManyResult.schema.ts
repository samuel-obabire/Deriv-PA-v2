import * as z from 'zod';
export const WithdrawalRequestFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  derivId: z.string(),
  amount: z.number(),
  amountNgn: z.number(),
  currency: z.string(),
  derivRef: z.string().optional(),
  createdAt: z.date(),
  status: z.unknown(),
  payout: z.unknown().optional()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});