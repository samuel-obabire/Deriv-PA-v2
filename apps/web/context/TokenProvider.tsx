"use client";

import { tryCatch } from "@repo/utils";
import { createContext, PropsWithChildren, useState } from "react";
import useCurrency from "@/hooks/useCurrency";
import { getValidAccessToken } from "@/lib/api/token";

export const TokenContext = createContext<{
	accessToken: string | null;
	tokenCurrency: string | null;
	fetchAccessToken: () => Promise<string | null>;
} | null>(null);

const TokenProvider = ({ children }: PropsWithChildren) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [tokenCurrency, setTokenCurrency] = useState<string | null>(null);
	const { selectedCurrency } = useCurrency();

	const fetchAccessToken = async () => {
		if (!selectedCurrency) return null;

		const [accessToken] = await tryCatch(() =>
			getValidAccessToken(selectedCurrency),
		);

		if (!accessToken) {
			setAccessToken(null);
			setTokenCurrency(null);

			return null;
		} else {
			setAccessToken(accessToken);
			setTokenCurrency(selectedCurrency);
			return accessToken;
		}
	};

	return (
		<TokenContext.Provider
			value={{
				accessToken,
				tokenCurrency,
				fetchAccessToken,
			}}
		>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenProvider;
