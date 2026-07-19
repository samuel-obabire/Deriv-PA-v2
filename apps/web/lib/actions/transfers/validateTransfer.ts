"use server";

import { getOneOrganizationCurrency } from "@repo/db/queries";
import { type ClientNameValidationResult } from "@repo/deriv";
import { ForbiddenError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { serverApi } from "@/lib/api/server-api";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { requireElevatedAccess } from "@/lib/session";
import { ValidateTransferActionSchema } from "@/lib/validations/deriv/transfer-actions";
import { ActionResponse } from "@/types/global";

export const validateTransfer = async (
	data: z.infer<typeof ValidateTransferActionSchema>,
): Promise<ActionResponse<ClientNameValidationResult>> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: ValidateTransferActionSchema,
			authorize: true,
			requireActiveOrganization: true,
		}),
	);

	if (error) return handleError(error);

	const organizationId = validated.session?.session
		.activeOrganizationId as string;

	// None of these three depend on each other's result, so they run
	// concurrently — matching the precedent in app/api/token/route.ts.
	const [checks, checksError] = await tryCatch(() =>
		Promise.all([
			requireElevatedAccess(validated.session),
			hasPermission({ payment: ["create"] }),
			getOneOrganizationCurrency(
				{
					organizationId,
					currencyCode: validated.params.data.currency,
				},
				db,
			),
		]),
	);

	if (checksError) return handleError(checksError);

	const [hasElevatedAccess, hasPaymentPermission, currency] = checks;

	if (!hasElevatedAccess || !hasPaymentPermission.success) {
		return handleError(new ForbiddenError("Transfer"));
	}

	const [response, requestError] = await tryCatch(() =>
		serverApi.validatePaymentAgentTransfer({
			organizationId,
			tokenId: currency.id,
			data: validated.params.data,
			options: validated.params.options,
		}),
	);

	if (requestError) return handleError(requestError);

	return response;
};
