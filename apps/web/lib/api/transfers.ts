import fetchHandler from "@repo/lib/handlers/fetch";
import { clientEnv } from "../validations/env/client";

export const transfersApi = {
	cancelTransfer: (transferId: string, orgId: string) =>
		fetchHandler(
			`${clientEnv.NEXT_PUBLIC_SERVER_URL}/transfers/${transferId}?orgId=${orgId}`,
			{ method: "DELETE" },
		),
};
