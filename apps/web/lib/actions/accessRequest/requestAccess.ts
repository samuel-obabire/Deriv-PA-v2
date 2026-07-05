"use server";

import "server-only";

import { ACCESS_REQUEST_ACTION } from "@repo/db/enums";
import {
	createAccessRequestAuditLog,
	createElevatedAccessGrant,
	deleteElevatedAccessGrant,
	getElevatedAccessGrantBySessionId,
} from "@repo/db/queries";
import { ValidationError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { RequestAccessSchema } from "@/lib/validations/accessRequest";
import { ActionResponse } from "@/types/global";

type RequestAccessResult = {
	status: "created" | "granted";
	grantId: string;
};

export const requestAccess = async (
	data: z.infer<typeof RequestAccessSchema>,
): Promise<ActionResponse<RequestAccessResult>> => {
	const [validated, validationError] = await tryCatch(() =>
		action({ params: data, schema: RequestAccessSchema, authorise: true }),
	);

	if (validationError) return handleError(validationError);

	const session = validated.session;
	if (!session) return handleError(new ValidationError("Not authenticated"));

	const organizationId = session.session.activeOrganizationId as string;
	const sessionId = session.session.id;

	const [existing, fetchError] = await tryCatch(() =>
		getElevatedAccessGrantBySessionId(sessionId, organizationId, db),
	);

	if (fetchError) return handleError(fetchError);

	if (existing) {
		const isActive =
			existing.isGranted &&
			existing.expiresAt !== null &&
			existing.expiresAt > new Date();

		if (isActive) {
			return {
				success: true,
				data: { status: "granted", grantId: existing.id },
			};
		}

		if (!existing.isGranted) {
			return handleError(
				new ValidationError("You already have a pending access request."),
			);
		}

		// A previously granted request has expired - clear it so a new one can be made.
		const [, deleteError] = await tryCatch(() =>
			deleteElevatedAccessGrant(existing.id, db),
		);
		if (deleteError) return handleError(deleteError);
	}

	const [created, createError] = await tryCatch(() =>
		createElevatedAccessGrant(
			{
				sessionId,
				targetUserId: session.user.id,
				organizationId,
				isGranted: false,
				expiresAt: null,
			},
			db,
		),
	);

	if (createError) return handleError(createError);

	await tryCatch(() =>
		createAccessRequestAuditLog(
			{
				organizationId,
				memberId: session.user.id,
				memberEmail: session.user.email,
				actionType: ACCESS_REQUEST_ACTION.REQUESTED,
				actorUserId: session.user.id,
				actorEmail: session.user.email,
			},
			db,
		),
	);

	return { success: true, data: { status: "created", grantId: created.id } };
};
