"use server";

import { getOneOrganizationCurrency } from "@repo/db/queries";
import { ForbiddenError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import * as z from "zod";
import { type ScheduledTransfer, serverApi } from "@/lib/api/server-api";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { requireElevatedAccess } from "@/lib/session";
import { ScheduleTransferActionSchema } from "@/lib/validations/deriv/transfer-actions";
import { ActionResponse } from "@/types/global";

export const scheduleTransfer = async (
	data: z.infer<typeof ScheduleTransferActionSchema>,
): Promise<ActionResponse<ScheduledTransfer>> => {
	const [validated, error] = await tryCatch(() =>
		action({
			params: data,
			schema: ScheduleTransferActionSchema,
			authorize: true,
			requireActiveOrganization: true,
		}),
	);

	if (error) return handleError(error);

	const organizationId = validated.session?.session
		.activeOrganizationId as string;
	const userId = validated.session?.session.userId as string;

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
		serverApi.scheduleTransfer({
			organizationId,
			tokenId: currency.id,
			userId,
			data: validated.params.data,
			options: validated.params.options,
		}),
	);

	if (requestError) return handleError(requestError);

	return response;
};
