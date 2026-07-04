import { getElevatedAccessGrantById } from "@repo/db/queries";
import { ForbiddenError, NotFoundError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const [session, sessionError] = await tryCatch(() => getSession());
	if (sessionError) return handleError(sessionError, "api");
	if (!session) return handleError(new ForbiddenError("Access request"), "api");

	const { id } = await params;

	const [grant, grantError] = await tryCatch(() =>
		getElevatedAccessGrantById(id, db),
	);
	if (grantError) return handleError(grantError, "api");
	if (!grant || grant.sessionId !== session.session.id)
		return handleError(new NotFoundError("Access request"), "api");

	const isGranted = Boolean(
		grant.isGranted && grant.expiresAt && grant.expiresAt > new Date(),
	);

	return NextResponse.json({ success: true, data: { isGranted } });
};
