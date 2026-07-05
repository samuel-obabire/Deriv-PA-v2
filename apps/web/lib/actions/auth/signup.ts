"use server";

import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { SignUpSchema } from "@/lib/validations/auth/sign-up";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { auth } from "../../auth";
import action from "../../handlers/action";

export const signUp = async (
	data: z.infer<typeof SignUpSchema>,
): Promise<ActionResponse> => {
	const [actionResult, validationError] = await tryCatch(() =>
		action({ params: data, schema: SignUpSchema, authorise: false }),
	);

	if (validationError) return handleError(validationError) as ErrorResponse;

	const [, userSignUpError] = await tryCatch(() =>
		auth.api.signUpEmail({ body: actionResult.params }),
	);

	if (userSignUpError) return handleError(userSignUpError) as ErrorResponse;

	return { success: true };
};
