import * as z from 'zod';

export const PayoutStatusSchema = z.enum(['UNMATCHED', 'MATCHED', 'FLAGGED'])

export type PayoutStatus = z.infer<typeof PayoutStatusSchema>;