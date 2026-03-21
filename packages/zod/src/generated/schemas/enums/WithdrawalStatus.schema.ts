import * as z from 'zod';

export const WithdrawalStatusSchema = z.enum(['PENDING', 'MATCHED', 'FLAGGED', 'MISSING'])

export type WithdrawalStatus = z.infer<typeof WithdrawalStatusSchema>;