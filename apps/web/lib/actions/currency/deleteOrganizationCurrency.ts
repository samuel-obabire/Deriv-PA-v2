"use server";

import { removeOrganizationCurrency } from "@repo/db/queries";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { DeleteOrganizationCurrencySchema } from "@/lib/validations/currency";
import { ActionResponse } from "@/types/global";

export const deleteOrganizationCurrency = async (
	data: z.infer<typeof DeleteOrganizationCurrencySchema>,
): Promise<ActionResponse> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: DeleteOrganizationCurrencySchema,
			authorise: true,
			requireActiveOrganization: true,
		}),
	);

	if (error) return handleError(error);

	const { code } = validated.params;

	const organizationId = validated.session?.session
		.activeOrganizationId as string; // surely present; validated in action call

	const [, deleteError] = await tryCatch(() =>
		removeOrganizationCurrency(
			{
				currencyCode: code,
				organizationId,
			},
			db,
		),
	);

	if (deleteError) return handleError(deleteError);

	return { success: true };
};
