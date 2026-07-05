"use server";

import { insertOrganizationCurrencyData } from "@repo/db/queries";
import handleError from "@repo/lib/http-errors";
import { encryptToken, tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { CurrencyCreateSchema } from "@/lib/validations/currency";
import { ActionResponse } from "@/types/global";

export const createOrganizationCurrency = async (
	data: z.infer<typeof CurrencyCreateSchema>,
): Promise<ActionResponse> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: CurrencyCreateSchema,
			authorise: true,
			requireActiveOrganization: true,
		}),
	);

	if (error) return handleError(error);

	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	const [, createError] = await tryCatch(() =>
		insertOrganizationCurrencyData(
			{
				...validated.params,
				token: encryptToken(validated.params.token),
				organizationId,
			},
			db,
		),
	);

	if (createError) return handleError(createError);

	return { success: true };
};
