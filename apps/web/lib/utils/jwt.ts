import { jwtDecode } from "jwt-decode";

const TOKEN_BUFFER = 1 * 60 * 1000;

export const isTokenValid = (token: string): boolean => {
	const decoded = jwtDecode(token);
	if (!decoded.exp) return false;
	return decoded.exp * 1000 - TOKEN_BUFFER > Date.now();
};
