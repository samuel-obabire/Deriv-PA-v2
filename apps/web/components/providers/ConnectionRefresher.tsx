"use client";

import { PropsWithChildren, useEffect } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import useSocket from "@/hooks/useSocket";

const ConnectionRefresher = ({ children }: PropsWithChildren) => {
	const { socket } = useSocket();
	const { accessToken, isTokenValid, refreshToken } = useAccessToken();

	useEffect(() => {
		// Register event after parameters are valid on initial load
		if (!socket || !accessToken) return;

		const handleVisibility = () => {
			if (document.visibilityState !== "visible") return;

			if (!isTokenValid(accessToken)) {
				refreshToken();
			}
		};

		document.addEventListener("visibilitychange", handleVisibility);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibility);
	}, [socket, accessToken, isTokenValid, refreshToken]);

	return <div>{children}</div>;
};

export default ConnectionRefresher;
