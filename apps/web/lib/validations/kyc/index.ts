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
	email: z
		.string()
		.optional()
		.refine((val) => !val || z.email().safeParse(val).success, {
			message: "Enter a valid email address",
		})
		.transform((val) => (val === "" ? undefined : val)),
	derivNickname: z
		.string()
		.min(2, "Deriv nickname must be at least 2 characters"),
	externalReferenceId: z.string().min(6, "Client ID is required"),
	whatsappNumber: z
		.string()
		.optional()
		.refine((val) => !val || val.length >= 7, {
			message: "Enter a valid WhatsApp number",
		})
		.refine((val) => !val || /^\+?[0-9\s-]+$/.test(val), {
			message: "Enter a valid WhatsApp number",
		})
		.transform((val) => (val === "" ? undefined : val)),
});

export const GetKycSignedUrlSchema = z.object({
	key: z.string().min(3),
});

export const ReviewKycRecordSchema = z.object({
	recordId: z.uuid(),
	action: z.enum(["approve", "reject"]),
	rejectionReason: z.enum(KYC_REJECTION_REASON).optional(),
});
