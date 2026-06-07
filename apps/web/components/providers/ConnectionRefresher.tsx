"use client";

import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import useSocket from "@/hooks/useSocket";

const ConnectionRefresher = ({ children }: PropsWithChildren) => {
	const { socket } = useSocket();
	const { accessToken, isTokenValid, refreshToken } = useAccessToken();

	const lockRef = useRef(false);

	const safeCheck = useCallback(async () => {
		if (lockRef.current) return;
		lockRef.current = true;

		try {
			if ((accessToken && !isTokenValid(accessToken)) || !socket) {
				await refreshToken();
			}
		} finally {
			setTimeout(() => {
				lockRef.current = false;
			}, 1000);
		}
	}, [accessToken, isTokenValid, refreshToken, socket]);

	useEffect(() => {
		if (!accessToken) return;

		const onVisibilityChange = () => {
			if (document.visibilityState === "visible") safeCheck();
		};

		const onFocus = () => safeCheck();
		const onOnline = () => safeCheck();
		const onPageShow = () => safeCheck();
		const onUserInteraction = () => safeCheck();

		document.addEventListener("visibilitychange", onVisibilityChange);

		window.addEventListener("focus", onFocus);
		window.addEventListener("online", onOnline);
		window.addEventListener("pageshow", onPageShow);

		window.addEventListener("touchstart", onUserInteraction, {
			passive: true,
		});
		window.addEventListener("click", onUserInteraction, {
			passive: true,
		});

		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);

			window.removeEventListener("focus", onFocus);
			window.removeEventListener("online", onOnline);
			window.removeEventListener("pageshow", onPageShow);

			window.removeEventListener("touchstart", onUserInteraction);
			window.removeEventListener("click", onUserInteraction);
		};
	}, [accessToken, safeCheck]);

	return <div>{children}</div>;
};

export default ConnectionRefresher;
