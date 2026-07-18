"use server";

import "server-only";

import { KYC_STATUS } from "@repo/db/enums";
import { createClientKycRecord } from "@repo/db/queries";
import { UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasKycPermission } from "@/lib/kyc-permission";
import { CreateClientKycRecordSchema } from "@/lib/validations/kyc";
import { ActionResponse } from "@/types/global";

export const createClientKycRecordAction = async (
	data: z.infer<typeof CreateClientKycRecordSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: CreateClientKycRecordSchema,
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
		fullName,
		email,
		derivNickname,
		externalReferenceId,
		whatsappNumber,
	} = validated.params;

	const [, createError] = await tryCatch(() =>
		createClientKycRecord(
			{
				organizationId,
				email,
				fullName,
				derivNickname,
				externalReferenceId,
				whatsappNumber,
				status: KYC_STATUS.VERIFIED,
			},
			db,
		),
	);

	if (createError) return handleError(createError);

	return { success: true };
};
