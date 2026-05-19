"use server";

import { updateOrganizationCurrencyData } from "@repo/db/queries";
import { encryptToken, tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import handleError from "@/lib/http-errors";
import { ActionResponse } from "@/lib/types/global";
import { UpdateOrganizationCurrencySchema } from "@/lib/validations/currency";

export const updateOrganizationCurrency = async (
	data: z.infer<typeof UpdateOrganizationCurrencySchema>,
): Promise<ActionResponse> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: UpdateOrganizationCurrencySchema,
			authorise: true,
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
