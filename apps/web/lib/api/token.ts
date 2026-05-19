import { api } from ".";

export const getValidAccessToken = async (currency: string) => {
	const res = await api.tokenService.getToken(currency);

	if (!res.success) throw new Error("Unable to fetch accessToken");

	return res.data?.accessToken;
};
