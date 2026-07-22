import { getClientKycRecordsByOrg, PAGE_LIMIT } from "@repo/db/queries";
import { ForbiddenError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";

import { getSearchParamsFromRequest } from "@/lib/utils/getSearchParamsFromRequest";
import { KycRecordQuerySchema } from "@/lib/validations/pagination";

export const GET = async (req: NextRequest) => {
	const searchParams = getSearchParamsFromRequest(req);

	const [actionResult, actionError] = await tryCatch(() =>
		action({
			params: searchParams,
			schema: KycRecordQuerySchema,
		}),
	);

	if (actionError) return handleError(actionError, "api");

	const [permitted, permissionError] = await tryCatch(() =>
		hasPermission({ kyc: ["manage"] }),
	);

	if (permissionError) return handleError(permissionError, "api");
	if (!permitted.success) {
		return handleError(new ForbiddenError("KYC Records"), "api");
	}

	const organizationId = actionResult.session?.session
		.activeOrganizationId as string;

	const {
		cursorDate,
		cursorId,
		limit = PAGE_LIMIT,
		email,
		externalReferenceId,
		derivNickname,
		name,
	} = actionResult.params;

	const fn = getClientKycRecordsByOrg(organizationId, db, {
		limit,
		email,
		externalReferenceId,
		derivNickname,
		name,
		...(cursorDate &&
			cursorId && {
				cursor: {
					createdAt: cursorDate,
					id: cursorId,
				},
			}),
	});

	const [records, getRecordsErr] = await tryCatch(() => fn);

	if (getRecordsErr) return handleError(getRecordsErr, "api");

	return NextResponse.json(
		{
			success: true,
			data: {
				records,
				cursor:
					records.length === PAGE_LIMIT
						? records[records.length - 1]
						: undefined,
			},
		},
		{
			status: 200,
		},
	);
};
