import * as z from 'zod';
import { WithdrawalStatusSchema } from '../enums/WithdrawalStatus.schema';

export const WithdrawalRequestSchema = z.object({
  id: z.string(),
  derivId: z.string(),
  amount: z.number(),
  amountNgn: z.number(),
  currency: z.string().default("USD"),
  derivRef: z.string().nullish(),
  createdAt: z.date(),
  status: WithdrawalStatusSchema.default("PENDING"),
});

export type WithdrawalRequestType = z.infer<typeof WithdrawalRequestSchema>;
