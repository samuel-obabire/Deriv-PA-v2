"use server";

import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { ActionResponse, ErrorResponse } from "@/lib/types/global";
import { SignInSchema } from "@/lib/validations/auth/sign-in";
import { auth } from "../../auth";
import action from "../../handlers/action";
import handleError from "../../http-errors";

export const signIn = async (
	data: z.infer<typeof SignInSchema>,
): Promise<ActionResponse> => {
	const [actionResult, validationError] = await tryCatch(() =>
		action({ params: data, schema: SignInSchema, authorise: false }),
	);

	if (validationError) return handleError(validationError) as ErrorResponse;

	const [, userSignInError] = await tryCatch(() =>
		auth.api.signInEmail({ body: actionResult.params }),
	);

	if (userSignInError) return handleError(userSignInError) as ErrorResponse;

	return { success: true };
};
