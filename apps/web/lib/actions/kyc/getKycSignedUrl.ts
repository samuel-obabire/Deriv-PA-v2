"use server";

import "server-only";

import { UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import action from "@/lib/handlers/action";
import { hasKycPermission } from "@/lib/kyc-permission";
import { getSignedUrl } from "@/lib/utils/uploadthing";
import { GetKycSignedUrlSchema } from "@/lib/validations/kyc";
import { ActionResponse } from "@/types/global";

export const getKycSignedUrl = async (
	key: string,
): Promise<ActionResponse<{ url: string }>> => {
	const [validated, validationError] = await tryCatch(() =>
		action({ params: { key }, schema: GetKycSignedUrlSchema, authorise: true }),
	);

	if (validationError) return handleError(validationError);

	const permitted = await hasKycPermission();
	if (!permitted)
		return handleError(new UnauthorizedError("Insufficient permissions"));

	const [url, urlError] = await tryCatch(() =>
		getSignedUrl(validated.params.key),
	);

	if (urlError) return handleError(urlError);

	return { success: true, data: { url } };
};
