import { Permissions, TokenPayload, tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { serverApi } from "@/lib/api/server-api";
import { UnauthorizedError } from "@/lib/errors";
import action from "@/lib/handlers/action";
import { hasPermission } from "@/lib/has-permission";
import handleError from "@/lib/http-errors";
import {
	GetTokenAccessRequestSchema,
	GetTokenAccessResponseSchema,
} from "@/lib/validations/auth/access-token";

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	const [verificationResult, verificationError] = await tryCatch(() =>
		action({
			params: body,
			schema: GetTokenAccessRequestSchema,
			authorise: true,
		}),
	);

	if (verificationError) return handleError(verificationError, "api");

	const { session } = verificationResult;

	try {
		if (!session || !session.session.activeOrganizationId)
			throw new UnauthorizedError();

		const hasPaymentPermission = await hasPermission({ payment: ["create"] });

		const tokenPayload: TokenPayload = {
			organizationId: session.session.activeOrganizationId,
			permissions: [
				Permissions.READ,
				...(hasPaymentPermission.success ? [Permissions.PAYMENTS] : []),
			],
			tokenId: "token-1",
			userId: session.session.userId,
		};

		const res = await serverApi.getToken(tokenPayload);

		const parsedResponse = GetTokenAccessResponseSchema.parse(res);

		if (!parsedResponse.success) {
			return NextResponse.json(
				{
					success: false,
					error: parsedResponse.error,
				},
				{
					status: 500,
				},
			);
		}
		return NextResponse.json(
			{
				success: true,
				data: { accessToken: parsedResponse.data?.accessToken },
			},
			{
				status: 200,
			},
		);
	} catch (error) {
		return handleError(error, "api");
	}
};
