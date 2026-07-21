import { CLIENT_CUSTOMER_TYPE, KYC_REJECTION_REASON } from "@repo/db/enums";
import * as z from "zod";

export const CUSTOMER_TYPES = [
	CLIENT_CUSTOMER_TYPE.EXISTING,
	CLIENT_CUSTOMER_TYPE.NEW,
] as const;

export const CreateKycInviteSchema = z.object({
	customerType: z.enum(CUSTOMER_TYPES),
});

export const CreateClientKycRecordSchema = z.object({
	fullName: z.string().min(5, "Full name must be at least 5 characters"),
	email: z.email("Enter a valid email address"),
	derivNickname: z
		.string()
		.min(2, "Deriv nickname must be at least 2 characters"),
	externalReferenceId: z.string().min(6, "Client ID is required"),
	whatsappNumber: z
		.string()
		.min(7, "Enter a valid WhatsApp number")
		.regex(/^\+?[0-9\s-]+$/, "Enter a valid WhatsApp number"),
});

export const GetKycSignedUrlSchema = z.object({
	key: z.string().min(3),
});

export const ReviewKycRecordSchema = z.object({
	recordId: z.uuid(),
	action: z.enum(["approve", "reject"]),
	rejectionReason: z.enum(KYC_REJECTION_REASON).optional(),
});
