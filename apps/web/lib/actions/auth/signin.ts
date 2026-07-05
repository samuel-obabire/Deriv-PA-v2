"use server";

import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { SignInSchema } from "@/lib/validations/auth/sign-in";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { auth } from "../../auth";
import action from "../../handlers/action";

export const signIn = async (
	data: z.infer<typeof SignInSchema>,
): Promise<ActionResponse> => {
	const [actionResult, validationError] = await tryCatch(() =>
		action({ params: data, schema: SignInSchema, authorize: false }),
	);

	if (validationError) return handleError(validationError) as ErrorResponse;

	const [, userSignInError] = await tryCatch(() =>
		auth.api.signInEmail({ body: actionResult.params }),
	);

	if (userSignInError) return handleError(userSignInError) as ErrorResponse;

	return { success: true };
};
