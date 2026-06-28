import fetchHandler from "@repo/lib/handlers/fetch";
import { TokenPayload } from "@repo/utils";
import { ActionResponse } from "../types/global";
import { clientEnv } from "../validations/env/client";

export const serverApi = {
	getToken: (payload: TokenPayload) =>
		fetchHandler<ActionResponse<{ accessToken: string }>>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/issue-token`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			},
		),
	revokeToken: (userId: string) =>
		fetchHandler<void>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/revoke-token`,
			{
				method: "POST",
				body: JSON.stringify({ userId }),
			},
		),
};
