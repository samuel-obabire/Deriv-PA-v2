import * as z from 'zod';

export const WithdrawalRequestScalarFieldEnumSchema = z.enum(['id', 'derivId', 'amount', 'amountNgn', 'currency', 'derivRef', 'createdAt', 'status'])

export type WithdrawalRequestScalarFieldEnum = z.infer<typeof WithdrawalRequestScalarFieldEnumSchema>;