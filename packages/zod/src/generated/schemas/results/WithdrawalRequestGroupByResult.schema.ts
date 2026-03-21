import * as z from 'zod';
export const WithdrawalRequestGroupByResultSchema = z.array(z.object({
  id: z.string(),
  derivId: z.string(),
  amount: z.number(),
  amountNgn: z.number(),
  currency: z.string(),
  derivRef: z.string(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    derivId: z.number(),
    amount: z.number(),
    amountNgn: z.number(),
    currency: z.number(),
    derivRef: z.number(),
    createdAt: z.number(),
    status: z.number(),
    payout: z.number()
  }).optional(),
  _sum: z.object({
    amount: z.number().nullable(),
    amountNgn: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    amount: z.number().nullable(),
    amountNgn: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    derivId: z.string().nullable(),
    amount: z.number().nullable(),
    amountNgn: z.number().nullable(),
    currency: z.string().nullable(),
    derivRef: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    derivId: z.string().nullable(),
    amount: z.number().nullable(),
    amountNgn: z.number().nullable(),
    currency: z.string().nullable(),
    derivRef: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));