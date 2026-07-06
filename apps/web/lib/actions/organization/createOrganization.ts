"use server";

import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { OrganizationWithMembers } from "@/lib/auth-client";
import action from "@/lib/handlers/action";
import { slugifyString } from "@/lib/utils/slugify";
import { CreateOrgSchema } from "@/lib/validations/organization";
import { ActionResponse } from "@/types/global";

const createOrganization = async (newOrgData: {
	orgName: string;
}): Promise<ActionResponse<OrganizationWithMembers>> => {
	const [validationResult, validationError] = await tryCatch(() =>
		action({
			params: newOrgData,
			schema: CreateOrgSchema,
			authorize: true,
			requireActiveOrganization: false,
		}),
	);

	if (validationError) return handleError(validationError);

	const {
		params: { orgName },
	} = validationResult;

	const [createdOrg, orgCreationError] = await tryCatch(async () =>
		auth.api.createOrganization({
			body: {
				name: orgName,
				slug: slugifyString(orgName),
			},
			headers: await headers(),
		}),
	);

	if (orgCreationError) return handleError(orgCreationError);

	return { success: true, data: createdOrg };
};

export { createOrganization };
