import { ForbiddenError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { serverApi } from "@/lib/api/server-api";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";

const ParamsSchema = z.object({ id: z.uuid() });

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;

	const [actionResult, actionError] = await tryCatch(() =>
		action({ params: { id }, schema: ParamsSchema }),
	);
	if (actionError) return handleError(actionError, "api");

	const [permitted, permissionError] = await tryCatch(() =>
		hasPermission({ statement: ["view"] }),
	);
	if (permissionError) return handleError(permissionError, "api");
	if (!permitted.success) {
		return handleError(new ForbiddenError("Transfer status"), "api");
	}

	const organizationId = actionResult.session?.session
		.activeOrganizationId as string;

	const [result, checkError] = await tryCatch(() =>
		serverApi.checkTransferStatus(actionResult.params.id, organizationId),
	);
	if (checkError) return handleError(checkError, "api");

	return NextResponse.json(result, { status: 200 });
};
