import fetchHandler from "@repo/lib/handlers/fetch";
import { ActionResponse } from "../../types/global";
import ROUTES from "../constants/routes";

export const tokenService = {
	getToken: async (currency: string) =>
		fetchHandler<ActionResponse<{ accessToken: string }>>(
			ROUTES.GET_ACCESS_TOKEN,
			{
				method: "POST",
				body: JSON.stringify({
					currency,
				}),
			},
		),
};
