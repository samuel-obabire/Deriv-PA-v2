import { Permissions, TokenPayload, tryCatch } from "@repo/utils";
import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/errors";
import action from "@/lib/handlers/action";
import fetchHandler from "@/lib/handlers/fetchHandler";
import handleError from "@/lib/http-errors";
import { ActionResponse } from "@/lib/types/global";
import {
	GetTokenAccessRequestSchema,
	GetTokenAccessResponseSchema,
} from "@/lib/validations/auth/access-token";
import { clientEnv } from "@/lib/validations/env/client";

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

		const tokenPayload: TokenPayload = {
			organizationId: session.session.activeOrganizationId,
			permissions: [Permissions.READ, Permissions.PAYMENTS],
			tokenId: "token-1",
			userId: session.session.userId,
		};

		const res = await fetchHandler<
			ActionResponse<{ accessToken: string; refreshToken: string }>
		>(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/issue-tokens`, {
			method: "POST",
			body: JSON.stringify(tokenPayload),
		});

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
		} else {
			return NextResponse.json(
				{
					success: true,
					data: { accessToken: parsedResponse.data?.accessToken },
				},
				{
					status: 200,
				},
			);
		}
	} catch (error) {
		return handleError(error, "api");
	}
};
