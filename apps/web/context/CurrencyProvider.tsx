"use client";

import { Currency } from "@repo/db";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

export const CurrencyContext = createContext<{
	currencyList: Omit<Currency, "token">[];
	selectedCurrency: string | null;
	onCurrencyChange: (selectedCurrency: string) => void;
} | null>(null);

type CurrencyProviderProps = PropsWithChildren<{
	currencyList: Omit<Currency, "token">[];
}>;

const CurrencyProvider = ({
	currencyList,
	children,
}: CurrencyProviderProps) => {
	const [lastActiveCurrency, setLastActiveCurrency] = useLocalStorage(
		"currency",
		"USD",
	);

	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

	useEffect(() => {
		setSelectedCurrency(lastActiveCurrency ?? null);
	}, [lastActiveCurrency]);

	const onCurrencyChange = (currency: string) => {
		setLastActiveCurrency(currency);
	};

	return (
		<CurrencyContext.Provider
			value={{ currencyList, selectedCurrency, onCurrencyChange }}
		>
			{children}
		</CurrencyContext.Provider>
	);
};

export default CurrencyProvider;
