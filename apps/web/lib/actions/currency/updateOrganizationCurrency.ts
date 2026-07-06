"use server";

import { updateOrganizationCurrencyData } from "@repo/db/queries";
import handleError from "@repo/lib/http-errors";
import { encryptToken, tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { UpdateOrganizationCurrencySchema } from "@/lib/validations/currency";
import { ActionResponse } from "@/types/global";

export const updateOrganizationCurrency = async (
	data: z.infer<typeof UpdateOrganizationCurrencySchema>,
): Promise<ActionResponse> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: UpdateOrganizationCurrencySchema,
			authorize: true,
			requireActiveOrganization: true,
		}),
	);

	if (error) return handleError(error);

	const { code, token } = validated.params;

	const organizationId = validated.session?.session
		.activeOrganizationId as string; // surely present; validated in action call

	const [, updateError] = await tryCatch(() =>
		updateOrganizationCurrencyData(
			{
				currencyCode: code,
				organizationId,
				data: { token: encryptToken(token) },
			},
			db,
		),
	);

	if (updateError) return handleError(updateError);

	return { success: true };
};
