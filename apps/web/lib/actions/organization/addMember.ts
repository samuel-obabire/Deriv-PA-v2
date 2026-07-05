"use server";

import "server-only";

import { getUserByEmail } from "@repo/db/queries";
import { NotFoundError, UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { addMember as authAddMember } from "@/lib/api/members";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { AddMemberSchema } from "@/lib/validations/organization";
import { ActionResponse } from "@/types/global";

export const addMember = async (
	data: z.infer<typeof AddMemberSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: AddMemberSchema,
			authorise: true,
			requireActiveOrganization: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const { email, role } = validated.params;
	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	const [foundUser, userError] = await tryCatch(() =>
		getUserByEmail(email, db),
	);

	if (!hasPermission({ organization: ["update"] }))
		return handleError(new UnauthorizedError());

	if (userError) return handleError(userError);
	if (!foundUser) return handleError(new NotFoundError("User"));

	const [, addError] = await tryCatch(() =>
		authAddMember({ userId: foundUser.id, role, organizationId }),
	);

	if (addError) return handleError(addError);

	revalidatePath(ROUTES.ORGANIZATION_MEMBERS);

	return { success: true };
};
