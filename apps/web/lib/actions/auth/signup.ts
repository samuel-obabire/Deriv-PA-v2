"use server";

import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { auth } from "../../auth";
import action from "../../handlers/action";
import handleError from "../../http-errors";
import { SignUpSchema } from "../../validations/auth/sign-up";

export const signUp = async (
	data: z.infer<typeof SignUpSchema>,
): Promise<ActionResponse> => {
	const [actionResult, validationError] = await tryCatch(() =>
		action({ params: data, schema: SignUpSchema, authorise: false }),
	);

	if (validationError) return handleError(validationError) as ErrorResponse;

	const [, userCreationError] = await tryCatch(() =>
		auth.api.signUpEmail({ body: actionResult.params }),
	);

	if (userCreationError) return handleError(userCreationError) as ErrorResponse;

	return { success: true };
};
