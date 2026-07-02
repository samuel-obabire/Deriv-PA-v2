"use server";

import "server-only";

import { createClientKycInvitation } from "@repo/db/queries";
import { UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { ActionResponse } from "@/lib/types/global";
import { generateInviteToken } from "@/lib/utils/kyc";
import { clientEnv } from "@/lib/validations/env/client";
import { CreateKycInviteSchema } from "@/lib/validations/kyc";

const KYC_INVITE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const createKycInvitation = async (
	data: z.infer<typeof CreateKycInviteSchema>,
): Promise<ActionResponse<{ inviteUrl: string }>> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: CreateKycInviteSchema,
			authorise: true,
			requireActiveOrganization: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const permitted = await hasPermission({ organization: ["update"] });
	if (!permitted)
		return handleError(new UnauthorizedError("Insufficient permissions"));

	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	const token = generateInviteToken();
	const expiresAt = new Date(Date.now() + KYC_INVITE_TTL_MS);

	const [, createError] = await tryCatch(() =>
		createClientKycInvitation(
			{
				organizationId,
				customerType: validated.params.customerType,
				tokenHash: token,
				expiresAt,
			},
			db,
		),
	);

	if (createError) return handleError(createError);

	const path = validated.params.mode === "update" ? ROUTES.HOME : ROUTES.KYC;
	const inviteUrl = `${clientEnv.NEXT_PUBLIC_CLIENT_KYC_URL}${path}?token=${token}`;

	return { success: true, data: { inviteUrl } };
};
