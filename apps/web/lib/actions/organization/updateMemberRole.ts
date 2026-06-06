"use server";

import "server-only";

import { tryCatch } from "@repo/utils";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { updateMemberRole as authUpdateMemberRole } from "@/lib/api/members";
import { serverApi } from "@/lib/api/server-api";
import ROUTES from "@/lib/constants/routes";
import { UnauthorizedError } from "@/lib/errors";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import handleError from "@/lib/http-errors";
import { ActionResponse } from "@/lib/types/global";
import { UpdateMemberRoleSchema } from "@/lib/validations/organization";

export const updateMemberRole = async (
	data: z.infer<typeof UpdateMemberRoleSchema>,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: data,
			schema: UpdateMemberRoleSchema,
			authorise: true,
			requireActiveOrganization: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const { memberId, userId, role } = validated.params;
	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	const permitted = await hasPermission({ organization: ["update"] });
	if (!permitted) return handleError(new UnauthorizedError());

	const [, updateError] = await tryCatch(() =>
		authUpdateMemberRole({ memberId, role, organizationId }),
	);

	if (updateError) return handleError(updateError);

	const [, revokeError] = await tryCatch(() => serverApi.revokeToken(userId));

	if (revokeError) return handleError(revokeError);

	revalidatePath(ROUTES.ORGANIZATION_MEMBERS);

	return { success: true };
};
