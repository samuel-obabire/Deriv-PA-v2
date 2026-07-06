"use server";

import { updateCurrentRate } from "@repo/db/queries";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { RateUpdateSchema } from "@/lib/validations/rate";
import { ActionResponse } from "@/types/global";

export const updateRate = async (
	data: z.infer<typeof RateUpdateSchema>,
): Promise<ActionResponse> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: RateUpdateSchema,
			authorize: true,
			requireActiveOrganization: true,
		}),
	);

	if (error) return handleError(error);

	const { deposit, withdrawal, charge, smallAmount, min, max } =
		validated.params;

	const [, updateError] = await tryCatch(() =>
		updateCurrentRate(
			{
				deposit,
				withdrawal,
				charge,
				smallAmount,
				min,
				max,
				organizationId: validated.session?.session
					.activeOrganizationId as string,
			},
			db,
		),
	);

	if (updateError) return handleError(updateError);

	return { success: true };
};
