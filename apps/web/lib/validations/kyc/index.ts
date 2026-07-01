import { CLIENT_CUSTOMER_TYPE, KYC_REJECTION_REASON } from "@repo/db/enums";
import * as z from "zod";

export const CUSTOMER_TYPES = [
	CLIENT_CUSTOMER_TYPE.EXISTING,
	CLIENT_CUSTOMER_TYPE.NEW,
] as const;

export const CreateKycInviteSchema = z.object({
	customerType: z.enum(CUSTOMER_TYPES),
});

export const GetKycSignedUrlSchema = z.object({
	key: z.string().min(3),
});

export const ReviewKycRecordSchema = z.object({
	recordId: z.uuid(),
	action: z.enum(["approve", "reject"]),
	rejectionReason: z.enum(KYC_REJECTION_REASON).optional(),
});
