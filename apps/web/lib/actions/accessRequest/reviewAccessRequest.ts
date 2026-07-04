"use server";

import "server-only";

import { ACCESS_REQUEST_ACTION } from "@repo/db/enums";
import {
	approveElevatedAccessGrant,
	createAccessRequestAuditLog,
	deleteElevatedAccessGrant,
	getElevatedAccessGrantById,
	getUser,
} from "@repo/db/queries";
import { NotFoundError, UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { ActionResponse } from "@/lib/types/global";
import { ReviewAccessRequestSchema } from "@/lib/validations/accessRequest";

const ELEVATED_ACCESS_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export const reviewAccessRequest = async (
	data: z.infer<typeof ReviewAccessRequestSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: ReviewAccessRequestSchema,
			authorise: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const { grantId, action: reviewAction } = validated.params;

	const permitted = await hasPermission({
		access_request: [reviewAction === "approve" ? "approve" : "reject"],
	});
	if (!permitted.success)
		return handleError(new UnauthorizedError("Insufficient permissions"));

	const session = validated.session;
	if (!session) return handleError(new UnauthorizedError());

	const organizationId = session.session.activeOrganizationId as string;

	const [grant, grantError] = await tryCatch(() =>
		getElevatedAccessGrantById(grantId, db),
	);

	if (grantError) return handleError(grantError);
	if (!grant || grant.organizationId !== organizationId)
		return handleError(new NotFoundError("Access request"));

	const [targetUser, userError] = await tryCatch(() =>
		getUser(grant.targetUserId, db),
	);
	if (userError) return handleError(userError);

	const memberEmail = targetUser?.email ?? "unknown";

	if (reviewAction === "approve") {
		const [, approveError] = await tryCatch(() =>
			approveElevatedAccessGrant(
				{
					id: grant.id,
					expiresAt: new Date(Date.now() + ELEVATED_ACCESS_TTL_MS),
				},
				db,
			),
		);
		if (approveError) return handleError(approveError);
	} else {
		const [, deleteError] = await tryCatch(() =>
			deleteElevatedAccessGrant(grant.id, db),
		);
		if (deleteError) return handleError(deleteError);
	}

	await tryCatch(() =>
		createAccessRequestAuditLog(
			{
				organizationId,
				memberId: grant.targetUserId,
				memberEmail,
				actionType:
					reviewAction === "approve"
						? ACCESS_REQUEST_ACTION.APPROVED
						: ACCESS_REQUEST_ACTION.REJECTED,
				actorUserId: session.user.id,
				actorEmail: session.user.email,
			},
			db,
		),
	);

	return { success: true };
};
