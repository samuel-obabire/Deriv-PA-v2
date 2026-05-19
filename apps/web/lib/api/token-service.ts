import ROUTES from "../constants/routes";
import fetchHandler from "../handlers/fetchHandler";
import { ActionResponse } from "../types/global";

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
