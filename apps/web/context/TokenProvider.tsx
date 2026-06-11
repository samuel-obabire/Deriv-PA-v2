"use client";

import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";
import useCurrency from "@/hooks/useCurrency";
import { getValidAccessToken } from "@/lib/api/token";
import { isTokenValid } from "@/lib/utils/jwt";

export const TokenContext = createContext<{
	accessToken: string | null;
	tokenCurrency: string | null;
	isTokenValid: (token: string) => boolean;
	refreshToken: () => Promise<void>;
} | null>(null);

const TokenProvider = ({ children }: PropsWithChildren) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [tokenCurrency, setTokenCurrency] = useState<string | null>(null);
	const { selectedCurrency } = useCurrency();

	const setToken = useCallback((token: string) => {
		setAccessToken(token);
	}, []);

	const fetchToken = useCallback(async () => {
		if (!selectedCurrency) return;

		const token = await getValidAccessToken(selectedCurrency);

		if (!token) throw new Error("Unable to fetch accessToken");

		setToken(token);
		setTokenCurrency(selectedCurrency);
	}, [setToken, selectedCurrency]);

	const refreshToken = async () => {
		await fetchToken();
	};

	useEffect(() => {
		fetchToken();
	}, [fetchToken]);

	return (
		<TokenContext.Provider
			value={{
				accessToken,
				tokenCurrency,
				isTokenValid,
				refreshToken,
			}}
		>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenProvider;
