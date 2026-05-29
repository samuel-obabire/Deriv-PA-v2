"use client";

import { useContext } from "react";
import { CurrencyContext } from "@/context/CurrencyProvider";

const useCurrency = () => {
	const context = useContext(CurrencyContext);

	if (!context)
		throw new Error("useCurrency must be called within CurrencysProvider");

	return context;
};

export default useCurrency;
