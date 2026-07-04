"use server";

import "server-only";

import { ACCESS_REQUEST_ACTION } from "@repo/db/enums";
import {
	createAccessRequestAuditLog,
	deleteElevatedAccessGrantsForUser,
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
import { RevokeAccessGrantSchema } from "@/lib/validations/accessRequest";

export const revokeAccessGrant = async (
	data: z.infer<typeof RevokeAccessGrantSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({ params: data, schema: RevokeAccessGrantSchema, authorise: true }),
	);

	if (validationError) return handleError(validationError);

	const permitted = await hasPermission({ access_request: ["revoke"] });
	if (!permitted.success)
		return handleError(new UnauthorizedError("Insufficient permissions"));

	const session = validated.session;
	if (!session) return handleError(new UnauthorizedError());

	const organizationId = session.session.activeOrganizationId as string;

	const [grant, grantError] = await tryCatch(() =>
		getElevatedAccessGrantById(validated.params.grantId, db),
	);

	if (grantError) return handleError(grantError);
	if (!grant || grant.organizationId !== organizationId)
		return handleError(new NotFoundError("Access grant"));

	const [targetUser, userError] = await tryCatch(() =>
		getUser(grant.targetUserId, db),
	);
	if (userError) return handleError(userError);

	const [, deleteError] = await tryCatch(() =>
		deleteElevatedAccessGrantsForUser(
			{ targetUserId: grant.targetUserId, organizationId },
			db,
		),
	);
	if (deleteError) return handleError(deleteError);

	await tryCatch(() =>
		createAccessRequestAuditLog(
			{
				organizationId,
				memberId: grant.targetUserId,
				memberEmail: targetUser?.email ?? "unknown",
				actionType: ACCESS_REQUEST_ACTION.REVOKED,
				actorUserId: session.user.id,
				actorEmail: session.user.email,
			},
			db,
		),
	);

	return { success: true };
};
