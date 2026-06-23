"use client";

import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import useSocket from "@/hooks/useSocket";

// If the app was hidden longer than this, force a full token refresh on return
// so the server-side Deriv session is always re-established. iOS can keep the
// socket.io pipe alive while pausing the underlying WebSocket, leaving the
// Deriv connection stale on the server even though the client thinks it's up.
const STALE_AFTER_MS = 10_000;

const ConnectionRefresher = ({ children }: PropsWithChildren) => {
	const { socket, isSocketBusy } = useSocket();
	const { accessToken, refreshToken } = useAccessToken();

	const lockRef = useRef(false);
	const hiddenAtRef = useRef<number | null>(null);

	const safeCheck = useCallback(
		async (force = false) => {
			if (lockRef.current) return;
			lockRef.current = true;

			try {
				// Only refresh  if the socket is truly dead
				// (not connected and not actively trying to connect/reconnect). Calling refreshToken()
				// while socket.io is mid-connection destroys the in-flight attempt by
				// triggering a new socket instance in SocketProvider, which loops on
				// every touch event until the connection finally has a chance to land.
				// const tokenExpired = accessToken && !isTokenValid(accessToken);
				const socketDead = !socket && !isSocketBusy();
				if (force || socketDead) {
					await refreshToken();
				}
			} finally {
				setTimeout(() => {
					lockRef.current = false;
				}, 1000);
			}
		},
		[refreshToken, socket, isSocketBusy],
	);

	useEffect(() => {
		if (!accessToken) return;

		const onVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				hiddenAtRef.current = Date.now();
			} else {
				const hiddenMs = hiddenAtRef.current
					? Date.now() - hiddenAtRef.current
					: 0;
				hiddenAtRef.current = null;
				// Force reconnect after a long background period

				safeCheck(hiddenMs >= STALE_AFTER_MS);
			}
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
