import * as z from 'zod';

export const PayoutScalarFieldEnumSchema = z.enum(['id', 'amount', 'recipientName', 'recipientAccount', 'reciepientBank', 'createdAt', 'withdrawalRequestId', 'status', 'flagReason'])

export type PayoutScalarFieldEnum = z.infer<typeof PayoutScalarFieldEnumSchema>;