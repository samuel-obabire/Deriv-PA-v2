"use server";

import "server-only";

import { KYC_STATUS } from "@repo/db/enums";
import {
	getClientKycRecordById,
	updateClientKycRecord,
} from "@repo/db/queries";
import { UnauthorizedError, ValidationError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasKycPermission } from "@/lib/kyc-permission";
import { InvalidateKycRecordSchema } from "@/lib/validations/kyc";
import { ActionResponse } from "@/types/global";

export const invalidateKycRecordAction = async (
	data: z.infer<typeof InvalidateKycRecordSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: InvalidateKycRecordSchema,
			authorize: true,
			requireActiveOrganization: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const permitted = await hasKycPermission();
	if (!permitted)
		return handleError(new UnauthorizedError("Insufficient permissions"));

	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	const { recordId, rejectionReason } = validated.params;

	const [record, recordError] = await tryCatch(() =>
		getClientKycRecordById(recordId, db),
	);

	if (recordError) return handleError(recordError);
	if (!record || record.organizationId !== organizationId)
		return handleError(new UnauthorizedError("Record not found"));

	if (record.status !== KYC_STATUS.VERIFIED)
		return handleError(
			new ValidationError("Only a verified record can be invalidated"),
		);

	const [, updateError] = await tryCatch(() =>
		updateClientKycRecord(
			{
				id: recordId,
				data: { status: KYC_STATUS.REJECTED, rejectionReason },
			},
			db,
		),
	);

	if (updateError) return handleError(updateError);

	return { success: true };
};
