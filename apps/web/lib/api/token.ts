import { api } from ".";

export const getValidAccessToken = async () => {
	const res = await api.tokenService.getToken();

	if (!res.success) throw new Error("Unable to fetch accessToken");

	return res.data?.accessToken;
};
