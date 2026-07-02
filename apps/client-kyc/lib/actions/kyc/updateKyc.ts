"use server";

import "server-only";

import { CLIENT_CUSTOMER_TYPE, KYC_STATUS } from "@repo/db/enums";
import {
	getClientKycRecordByEmail,
	getValidClientKycInvitationByTokenHash,
	updateKycRecordAndBurnInvitation,
} from "@repo/db/queries";
import { NotFoundError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import type { Session } from "@/lib/auth";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import {
	ExistingClientKycSubmitSchema,
	type KycFormData,
	KycSubmitInputSchema,
	NewClientKycSubmitSchema,
} from "@/lib/validations/kyc";

export const updateKycAction = async (
	token: string,
	data: KycFormData,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: { token, ...data },
			schema: KycSubmitInputSchema,
			authorise: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const session = validated.session as Session;

	const [invitation, inviteError] = await tryCatch(() =>
		getValidClientKycInvitationByTokenHash(validated.params.token, db),
	);

	if (inviteError) return handleError(inviteError);
	if (!invitation) return handleError(new NotFoundError("Invitation link"));

	const [kycRecord, recordError] = await tryCatch(() =>
		getClientKycRecordByEmail(
			{ email: session.user.email, organizationId: invitation.organizationId },
			db,
		),
	);

	if (recordError) return handleError(recordError);
	if (!kycRecord) return handleError(new NotFoundError("KYC record"));

	if (invitation.customerType === CLIENT_CUSTOMER_TYPE.NEW) {
		const [parsedData, parseError] = await tryCatch(() =>
			NewClientKycSubmitSchema.parseAsync(validated.params),
		);

		if (parseError) return handleError(parseError);

		const [, txError] = await tryCatch(() =>
			updateKycRecordAndBurnInvitation(
				{
					id: kycRecord.id,
					data: {
						fullName: parsedData.fullName,
						derivNickname: parsedData.derivNickname,
						whatsappNumber: parsedData.whatsappNumber,
						status: KYC_STATUS.PENDING_REVIEW,
						documentType: parsedData.documentType,
						idFrontKey: parsedData.idFrontKey,
						idBackKey: parsedData.idBackKey,
						selfieVideoKey: parsedData.selfieVideoKey,
					},
				},
				invitation.id,
				db,
			),
		);

		if (txError) return handleError(txError);
	} else {
		const [parsedData, parseError] = await tryCatch(() =>
			ExistingClientKycSubmitSchema.parseAsync(validated.params),
		);

		if (parseError) return handleError(parseError);

		const [, txError] = await tryCatch(() =>
			updateKycRecordAndBurnInvitation(
				{
					id: kycRecord.id,
					data: {
						fullName: parsedData.fullName,
						derivNickname: parsedData.derivNickname,
						whatsappNumber: parsedData.whatsappNumber,
						status: KYC_STATUS.PENDING_REVIEW,
					},
				},
				invitation.id,
				db,
			),
		);

		if (txError) return handleError(txError);
	}

	return { success: true };
};
