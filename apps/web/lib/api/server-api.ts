import { TokenPayload } from "@repo/utils";

import fetchHandler from "../handlers/fetchHandler";
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
};
