"use server";

import { updateCurrentRate } from "@repo/db/queries";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import handleError from "@/lib/http-errors";
import { ActionResponse } from "@/lib/types/global";
import { RateUpdateSchema } from "@/lib/validations/rate";

export const updateRate = async (
	data: z.infer<typeof RateUpdateSchema>,
): Promise<ActionResponse> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: RateUpdateSchema,
			authorise: true,
		}),
	);

	if (error) return handleError(error);

	const { deposit, withdrawal, charge, smallAmount } = validated.params;

	const [, updateError] = await tryCatch(() =>
		updateCurrentRate(db, { deposit, withdrawal, charge, smallAmount }),
	);

	if (updateError) return handleError(updateError);

	return { success: true };
};
