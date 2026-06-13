"use client";

import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import useSocket from "@/hooks/useSocket";

const ConnectionRefresher = ({ children }: PropsWithChildren) => {
	const { socket, isSocketBusy } = useSocket();
	const { accessToken, isTokenValid, refreshToken } = useAccessToken();

	const lockRef = useRef(false);

	const safeCheck = useCallback(async () => {
		if (lockRef.current) return;
		lockRef.current = true;

		try {
			// Only refresh if the token is expired, or if the socket is truly dead
			// (not connected and not actively trying to connect). Calling refreshToken()
			// while socket.io is mid-connection destroys the in-flight attempt by
			// triggering a new socket instance in SocketProvider, which loops on
			// every touch event until the connection finally has a chance to land.
			const tokenExpired = accessToken && !isTokenValid(accessToken);
			const socketDead = !socket && !isSocketBusy();
			if (tokenExpired || socketDead) {
				await refreshToken();
			}
		} finally {
			setTimeout(() => {
				lockRef.current = false;
			}, 1000);
		}
	}, [accessToken, isTokenValid, refreshToken, socket, isSocketBusy]);

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
		window.addEventListener("pointerdown", onUserInteraction, {
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
			window.removeEventListener("pointerdown", onUserInteraction);
			window.removeEventListener("click", onUserInteraction);
		};
	}, [accessToken, safeCheck]);

	return <div>{children}</div>;
};

export default ConnectionRefresher;
