"use server";

import { updateCurrentRate } from "@repo/db/queries";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import handleError from "@/lib/http-errors";
import { RateUpdateSchema } from "@/lib/validations/rate";

export const updateRate = async (
	data: z.infer<typeof RateUpdateSchema>,
): Promise<ActionResponse> => {
	const { data: validated, error } = await tryCatch(
		action({
			params: data,
			schema: RateUpdateSchema,
			authorise: true,
		}),
	);

	if (error) return handleError(error) as ErrorResponse;

	const { deposit, withdrawal } = validated.params;

	const { error: updateError } = await tryCatch(
		updateCurrentRate(db, { deposit, withdrawal }),
	);

	if (updateError) return handleError(updateError) as ErrorResponse;

	return { success: true };
};
