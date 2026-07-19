"use server";

import "server-only";

import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { cookies } from "next/headers";
import * as z from "zod";
import { KYC_INVITE_TOKEN_COOKIE } from "@/lib/constants/kyc";
import action from "@/lib/handlers/action";

const PersistKycInviteTokenSchema = z.object({
	token: z.string().min(1, "Token is required"),
});

export const persistKycInviteTokenAction = async (
	token: string,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: { token },
			schema: PersistKycInviteTokenSchema,
			authorize: true,
		}),
	);

	if (validationError) return handleError(validationError);

	const cookieStore = await cookies();

	cookieStore.set(KYC_INVITE_TOKEN_COOKIE, validated.params.token, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 60 * 15,
		path: "/",
	});

	return { success: true };
};
