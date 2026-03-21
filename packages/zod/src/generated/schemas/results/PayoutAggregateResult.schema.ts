import * as z from 'zod';
export const PayoutAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    amount: z.number(),
    recipientName: z.number(),
    recipientAccount: z.number(),
    reciepientBank: z.number(),
    createdAt: z.number(),
    withdrawalRequestId: z.number(),
    withdrawal: z.number(),
    status: z.number(),
    flagReason: z.number()
  }).optional(),
  _sum: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    amount: z.number().nullable(),
    recipientName: z.string().nullable(),
    recipientAccount: z.string().nullable(),
    reciepientBank: z.string().nullable(),
    createdAt: z.date().nullable(),
    withdrawalRequestId: z.string().nullable(),
    flagReason: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    amount: z.number().nullable(),
    recipientName: z.string().nullable(),
    recipientAccount: z.string().nullable(),
    reciepientBank: z.string().nullable(),
    createdAt: z.date().nullable(),
    withdrawalRequestId: z.string().nullable(),
    flagReason: z.string().nullable()
  }).nullable().optional()});