import * as z from 'zod';
export const PayoutFindManyResultSchema = z.object({
  data: z.array(z.object({
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