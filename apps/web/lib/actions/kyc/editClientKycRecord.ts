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
import { revalidatePath } from "next/cache";
import * as z from "zod";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasKycPermission } from "@/lib/kyc-permission";
import { EditClientKycRecordSchema } from "@/lib/validations/kyc";
import { ActionResponse } from "@/types/global";

export const editClientKycRecordAction = async (
	data: z.infer<typeof EditClientKycRecordSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: EditClientKycRecordSchema,
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

	const {
		recordId,
		fullName,
		email,
		derivNickname,
		externalReferenceId,
		whatsappNumber,
	} = validated.params;

	const [record, recordError] = await tryCatch(() =>
		getClientKycRecordById(recordId, db),
	);

	if (recordError) return handleError(recordError);
	if (!record || record.organizationId !== organizationId)
		return handleError(new UnauthorizedError("Record not found"));

	const [, updateError] = await tryCatch(() =>
		updateClientKycRecord(
			{
				id: recordId,
				data: {
					fullName,
					email,
					derivNickname,
					externalReferenceId,
					whatsappNumber,
					status: KYC_STATUS.VERIFIED,
				},
			},
			db,
		),
	);

	if (updateError) return handleError(updateError);

	revalidatePath(ROUTES.KYC_RECORDS);

	return { success: true };
};
