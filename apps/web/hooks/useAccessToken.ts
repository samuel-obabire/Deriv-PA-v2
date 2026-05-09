"use client";

import { useContext } from "react";
import { TokenContext } from "@/context/TokenProvider";

const useAccessToken = () => {
	const context = useContext(TokenContext);

	if (!context)
		throw new Error("useAccessToken must be called within TokenProvider");

	return context;
};

export default useAccessToken;
