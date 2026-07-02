import { KYC_DOCUMENT_TYPE } from "@repo/db/enums";
import { isValidPhoneNumber } from "libphonenumber-js";
import * as z from "zod";
import { documentTypeHasBackView } from "@/lib/constants/kyc";

const Identity = {
	fullName: z.string().min(5, "Full name must be at least 5 characters"),
	derivNickname: z
		.string()
		.min(2, "Deriv nickname must be at least 2 characters"),
};

const phoneSchema = z
	.string()
	.min(1, "WhatsApp number is required")
	.refine(isValidPhoneNumber, "Enter a valid WhatsApp number");

const Contact = {
	whatsappNumber: phoneSchema,
};

const Document = {
	documentType: z.enum(KYC_DOCUMENT_TYPE, {
		message: "Select a document type",
	}),
	idFrontKey: z.string().min(1, "Front photo is required. Please capture it"),
	idBackKey: z.string().optional(),
};

const VideoSelfie = {
	selfieVideoKey: z
		.string()
		.min(1, "Selfie video is required. Please record it"),
};

export const DocumentSchema = z.object(Document).superRefine((data, ctx) => {
	if (documentTypeHasBackView(data.documentType) && !data.idBackKey) {
		ctx.addIssue({
			code: "custom",
			message: "Back photo is required. Please capture it",
			path: ["idBackKey"],
		});
	}
});

// Per-customerType schemas used for strict server-side validation
export const NewClientKycSubmitSchema = z
	.object(Identity)
	.extend(Contact)
	.extend(Document)
	.extend(VideoSelfie)
	.superRefine((data, ctx) => {
		if (documentTypeHasBackView(data.documentType) && !data.idBackKey) {
			ctx.addIssue({
				code: "custom",
				message: "Back photo is required",
				path: ["idBackKey"],
			});
		}
	});

export const ExistingClientKycSubmitSchema = z.object(Identity).extend(Contact);

// Document/video fields are optional here — strict validation happens after
// the invitation is fetched and customerType is confirmed.
export const KycSubmitInputSchema = z
	.object({ token: z.string().min(1, "Token is required") })
	.extend(Identity)
	.extend(Contact)
	.extend({
		documentType: Document.documentType.optional(),
		idFrontKey: Document.idFrontKey.optional(),
		idBackKey: Document.idBackKey.optional(),
		selfieVideoKey: VideoSelfie.selfieVideoKey.optional(),
	});

export const IdentitySchema = z.object(Identity);
export const ContactSchema = z.object(Contact);
export const VideoSelfieSchema = z.object(VideoSelfie);

export type KycFormData = Partial<
	z.infer<typeof IdentitySchema> &
		z.infer<typeof ContactSchema> &
		z.infer<typeof DocumentSchema> & {
			idFrontPreview: string;
			idBackPreview: string;
		} & z.infer<typeof VideoSelfieSchema> & {
			selfieVideoPreview: string;
		}
>;
