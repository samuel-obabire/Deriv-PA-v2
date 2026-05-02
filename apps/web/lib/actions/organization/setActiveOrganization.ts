"use server";

import { User } from "@repo/db";
import { updateUser } from "@repo/db/queries";
import { tryCatch } from "@repo/utils";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import handleError from "@/lib/http-errors";
import { ActionResponse } from "@/lib/types/global";
import { SetActiveOrgSchema } from "@/lib/validations/organization";

export const setUserActiveOrganization = async (orgData: {
	orgId: string;
}): Promise<ActionResponse<Partial<User>>> => {
	const [validationResult, validationError] = await tryCatch(() =>
		action({
			params: orgData,
			schema: SetActiveOrgSchema,
			authorise: true,
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
