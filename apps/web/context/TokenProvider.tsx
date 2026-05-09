"use client";

import { jwtDecode } from "jwt-decode";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";
import { getValidAccessToken } from "@/lib/api/token";

export const TokenContext = createContext<{
	accessToken: string | null;
	isFetching: boolean;
	isTokenValid: (token: string) => boolean;
} | null>(null);

const TokenProvider = ({ children }: PropsWithChildren) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isFetching, setIsFetching] = useState(true);

	//todo: register event to ensure token is valid on focus

	const getToken = useCallback(async () => {
		try {
			const accessToken = await getValidAccessToken();

			if (!accessToken) throw new Error("Unable to fetch accessToken");

			setAccessToken(accessToken);
		} catch (error) {
			console.error(error);
		} finally {
			setIsFetching(false);
		}
	}, []);

	const isTokenValid = (token: string) => {
		//todo move the jwt logic to its own file

		const TOKEN_BUFFER = 30 * 1000; // 30 seconds

		const decoded = jwtDecode(token);

		if (!decoded.exp) return false;

		console.log(decoded.exp * 1000 - TOKEN_BUFFER > Date.now());

		return decoded.exp * 1000 - TOKEN_BUFFER > Date.now();
	};

	useEffect(() => {
		getToken();
	}, [getToken]);

	return (
		<TokenContext.Provider value={{ accessToken, isFetching, isTokenValid }}>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenProvider;
