"use server";

import "server-only";

import { KYC_STATUS } from "@repo/db/enums";
import {
	getClientKycRecordById,
	updateClientKycRecord,
} from "@repo/db/queries";
import { UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasKycPermission } from "@/lib/kyc-permission";
import { ReviewKycRecordSchema } from "@/lib/validations/kyc";
import { ActionResponse } from "@/types/global";

export const reviewKycRecord = async (
	data: z.infer<typeof ReviewKycRecordSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({ params: data, schema: ReviewKycRecordSchema, authorise: true }),
	);

	if (validationError) return handleError(validationError);

	const permitted = await hasKycPermission();
	if (!permitted)
		return handleError(new UnauthorizedError("Insufficient permissions"));

	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	const [record, recordError] = await tryCatch(() =>
		getClientKycRecordById(validated.params.recordId, db),
	);

	if (recordError) return handleError(recordError);
	if (!record || record.organizationId !== organizationId)
		return handleError(new UnauthorizedError("Record not found"));

	const { action: reviewAction, rejectionReason } = validated.params;

	const [, updateError] = await tryCatch(() =>
		updateClientKycRecord(
			{
				id: record.id,
				data: {
					status:
						reviewAction === "approve"
							? KYC_STATUS.VERIFIED
							: KYC_STATUS.REJECTED,
					rejectionReason:
						reviewAction === "reject" ? (rejectionReason ?? null) : null,
				},
			},
			db,
		),
	);

	if (updateError) return handleError(updateError);

	return { success: true };
};
