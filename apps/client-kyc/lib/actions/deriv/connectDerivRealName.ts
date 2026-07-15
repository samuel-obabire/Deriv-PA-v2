"use server";

import "server-only";

import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import ROUTES from "@/lib/constants/routes";
import action from "@/lib/handlers/action";
import {
	exchangeDerivAuthorizationCode,
	setDerivShowRealName,
} from "@/lib/utils/deriv";
import { DerivConnectCallbackSchema } from "@/lib/validations/deriv";
import { clientEnv } from "@/lib/validations/env/client";

export const connectDerivRealNameAction = async (
	code: string,
	codeVerifier: string,
): Promise<ActionResponse> => {
	const [validated, validationError] = await tryCatch(() =>
		action({
			params: { code, codeVerifier },
			schema: DerivConnectCallbackSchema,
			authorize: false,
		}),
	);

	if (validationError) return handleError(validationError);

	const [accessToken, exchangeError] = await tryCatch(() =>
		exchangeDerivAuthorizationCode({
			appId: clientEnv.NEXT_PUBLIC_DERIV_APP_ID,
			code: validated.params.code,
			codeVerifier: validated.params.codeVerifier,
			redirectUri: `${clientEnv.NEXT_PUBLIC_URL}${ROUTES.DERIV_CALLBACK}`,
		}),
	);

	if (exchangeError) return handleError(exchangeError);

	const [, patchError] = await tryCatch(() =>
		setDerivShowRealName(accessToken),
	);

	if (patchError) return handleError(patchError);

	return { success: true };
};
