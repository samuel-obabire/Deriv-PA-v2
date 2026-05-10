"use client";

import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";
import { getValidAccessToken } from "@/lib/api/token";
import { isTokenValid } from "@/lib/utils/jwt";

export const TokenContext = createContext<{
	accessToken: string | null;
	isTokenValid: (token: string) => boolean;
	refreshToken: () => Promise<void>;
} | null>(null);

const TokenProvider = ({ children }: PropsWithChildren) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);

	const setToken = useCallback((token: string) => {
		setAccessToken(token);
	}, []);

	const fetchToken = useCallback(async () => {
		const token = await getValidAccessToken();

		if (!token) throw new Error("Unable to fetch accessToken");

		setToken(token);
	}, [setToken]);

	const refreshToken = async () => {
		const token = await getValidAccessToken();

		if (!token) throw new Error("Unable to fetch accessToken");

		setToken(token);
	};

	useEffect(() => {
		fetchToken();
	}, [fetchToken]);

	return (
		<TokenContext.Provider
			value={{
				accessToken,
				isTokenValid,
				refreshToken,
			}}
		>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenProvider;
