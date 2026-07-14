import { getOneOrganizationCurrency } from "@repo/db/queries";
import { NotFoundError, UnauthorizedError } from "@repo/lib/errors";
import handleError from "@repo/lib/http-errors";
import { Permissions, TokenPayload, tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/api/server-api";
import { type SessionWithActiveOrg } from "@/lib/auth";
import { db } from "@/lib/db";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import { requireElevatedAccess } from "@/lib/session";
import {
	GetTokenAccessRequestSchema,
	GetTokenAccessResponseSchema,
} from "@/lib/validations/auth/access-token";

const buildTokenPayload = (
	session: SessionWithActiveOrg,
	currencyId: string,
	hasPaymentAccess: boolean,
): TokenPayload => ({
	organizationId: session.session.activeOrganizationId,
	userId: session.session.userId,
	tokenId: currencyId,
	permissions: [
		Permissions.READ,
		...(hasPaymentAccess ? [Permissions.PAYMENTS] : []),
	],
});

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	const [verificationResult, verificationError] = await tryCatch(() =>
		action({
			params: body,
			schema: GetTokenAccessRequestSchema,
			authorize: true,
		}),
	);

	if (verificationError) {
		return handleError(verificationError, "api");
	}

	const { session, params } = verificationResult;

	if (!session?.session.activeOrganizationId) {
		throw new UnauthorizedError();
	}

	const activeOrgSession = session as SessionWithActiveOrg;

	try {
		const [hasElevatedAccess, currency, hasPaymentPermission] =
			await Promise.all([
				requireElevatedAccess(activeOrgSession),
				getOneOrganizationCurrency(
					{
						currencyCode: params.currency,
						organizationId: activeOrgSession.session.activeOrganizationId,
						options: {
							includeToken: false,
						},
					},
					db,
				),
				hasPermission({
					payment: ["create"],
				}),
			]);

		if (!currency) {
			throw new NotFoundError("Currency");
		}

		const isPaymentPermitted =
			hasPaymentPermission.success && hasElevatedAccess;

		const tokenPayload = buildTokenPayload(
			activeOrgSession,
			currency.id,
			isPaymentPermitted,
		);

		const tokenResponse = await serverApi.getToken(tokenPayload);

		const parsedResponse = GetTokenAccessResponseSchema.parse(tokenResponse);

		if (!parsedResponse.success) {
			return NextResponse.json(
				{
					success: false,
					error: parsedResponse.error,
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				data: {
					accessToken: parsedResponse.data.accessToken,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		return handleError(error, "api");
	}
};
