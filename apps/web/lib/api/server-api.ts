import fetchHandler from "@repo/lib/handlers/fetch";
import { TokenPayload } from "@repo/utils";
import { ActionResponse } from "../../types/global";
import { clientEnv } from "../validations/env/client";
import { serverEnv } from "../validations/env/server";

export const serverApi = {
	getToken: (payload: TokenPayload) =>
		fetchHandler<ActionResponse<{ accessToken: string }>>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/issue-token`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${serverEnv.BACKEND_API_TOKEN}`,
				},
				body: JSON.stringify(payload),
			},
		),
	revokeToken: (userId: string) =>
		fetchHandler<void>(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/authentication/revoke-token`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${serverEnv.BACKEND_API_TOKEN}`,
				},
				body: JSON.stringify({ userId }),
			},
		),
};
