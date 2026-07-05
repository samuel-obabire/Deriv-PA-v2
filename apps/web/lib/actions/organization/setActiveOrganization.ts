"use server";

import { User } from "@repo/db";
import { updateUser } from "@repo/db/queries";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { SetActiveOrgSchema } from "@/lib/validations/organization";
import { ActionResponse } from "@/types/global";

export const setUserActiveOrganization = async (orgData: {
	orgId: string;
}): Promise<ActionResponse<Partial<User>>> => {
	const [validationResult, validationError] = await tryCatch(() =>
		action({
			params: orgData,
			schema: SetActiveOrgSchema,
			authorise: true,
			requireActiveOrganization: false,
		}),
	);

	if (validationError) return handleError(validationError);

	const {
		params: { orgId },
		session,
	} = validationResult;

	const [updatedUser, updateUserError] = await tryCatch(() =>
		updateUser(
			{
				userId: session?.session.userId as string,
				data: { activeOrgId: orgId },
			},
			db,
		),
	);

	if (updateUserError) return handleError(updateUserError);

	return { success: true, data: updatedUser };
};
