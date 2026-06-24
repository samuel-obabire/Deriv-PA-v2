"use client";

import { WsAuthError } from "@repo/utils";
import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { io, Socket } from "socket.io-client";

import useAccessToken from "@/hooks/useAccessToken";
import SocketClient from "@/lib/socketClient";
import { clientEnv } from "@/lib/validations/env/client";

type SocketProviderProps = {
	children: ReactNode;
};

export const SocketContext = createContext<{
	socket: Socket | null;
	socketClient: SocketClient | null;
	isConnecting: boolean;
} | null>(null);

const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketClient, setSocketClient] = useState<SocketClient | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);

	const socketRef = useRef<Socket | null>(null);
	const clientRef = useRef<SocketClient | null>(null);
	const destroyedRef = useRef(false);
	const connectingRef = useRef(false);

	const { fetchAccessToken } = useAccessToken();

	const cleanupAuthorizedClient = useCallback(() => {
		clientRef.current?.dispose();
		clientRef.current = null;

		setSocket(null);
		setSocketClient(null);
	}, []);

	const connect = useCallback(async () => {
		if (destroyedRef.current) return;

		const instance = socketRef.current;

		if (
			!instance ||
			instance.connected ||
			instance.active ||
			connectingRef.current
		) {
			return;
		}

		cleanupAuthorizedClient();

		connectingRef.current = true;
		setIsConnecting(true);

		try {
			const accessToken = await fetchAccessToken();

			if (destroyedRef.current) return;

			if (!accessToken) {
				cleanupAuthorizedClient();
				setIsConnecting(false);
				return;
			}

			instance.auth = {
				accessToken,
			};

			instance.connect();
		} catch {
			setIsConnecting(false);
		} finally {
			connectingRef.current = false;
		}
	}, [cleanupAuthorizedClient, fetchAccessToken]);

	useEffect(() => {
		destroyedRef.current = false;

		const instance = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			transports: ["websocket"],
			autoConnect: false,
			reconnection: false,
		});

		socketRef.current = instance;

		const reconnectIfNeeded = () => {
			if (!socketRef.current?.connected) {
				connect();
			}
		};

		const handleConnect = async () => {
			try {
				const client = new SocketClient(instance);

				await client.authorize({
					authorize: "",
				});

				if (destroyedRef.current || !instance.connected) {
					client.dispose();
					return;
				}

				clientRef.current = client;

				setSocket(instance);
				setSocketClient(client);
			} catch {
				instance.disconnect();
			} finally {
				setIsConnecting(false);
			}
		};

		const handleDisconnect = (reason: string) => {
			cleanupAuthorizedClient();

			if (destroyedRef.current) return;

			setIsConnecting(false);

			if (reason === "io client disconnect") {
				return;
			}

			if (document.visibilityState === "visible" && navigator.onLine) {
				connect();
			}
		};

		const handleConnectError = async (err: Error) => {
			if (destroyedRef.current) return;

			if (
				err.message === WsAuthError.MissingAuthParams ||
				err.message === WsAuthError.AccessDenied ||
				err.message === WsAuthError.InvalidToken
			) {
				const accessToken = await fetchAccessToken();

				if (destroyedRef.current) return;

				if (!accessToken) {
					instance.disconnect();
					setIsConnecting(false);
					return;
				}

				instance.auth = {
					accessToken,
				};

				if (!instance.connected && !instance.active) {
					instance.connect();
				}

				return;
			}

			setIsConnecting(false);
		};

		const handleVisibilityReconnect = () => {
			if (document.visibilityState === "visible") {
				reconnectIfNeeded();
			}
		};

		const handleFocusReconnect = () => {
			reconnectIfNeeded();
		};

		const handleOnlineReconnect = () => {
			reconnectIfNeeded();
		};

		instance.on("connect", handleConnect);
		instance.on("disconnect", handleDisconnect);
		instance.on("connect_error", handleConnectError);

		document.addEventListener("visibilitychange", handleVisibilityReconnect);

		window.addEventListener("focus", handleFocusReconnect);
		window.addEventListener("pageshow", handleFocusReconnect);
		window.addEventListener("online", handleOnlineReconnect);

		connect();

		return () => {
			destroyedRef.current = true;

			document.removeEventListener(
				"visibilitychange",
				handleVisibilityReconnect,
			);

			window.removeEventListener("focus", handleFocusReconnect);
			window.removeEventListener("pageshow", handleFocusReconnect);
			window.removeEventListener("online", handleOnlineReconnect);

			instance.removeAllListeners();
			instance.disconnect();

			clientRef.current?.dispose();

			clientRef.current = null;
			socketRef.current = null;
		};
	}, [cleanupAuthorizedClient, connect, fetchAccessToken]);

	return (
		<SocketContext.Provider
			value={{
				socket,
				socketClient,
				isConnecting,
			}}
		>
			{children}

			<div
				className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
				style={{
					opacity: isConnecting ? 1 : 0,
					transform: `translateX(-50%) translateY(${
						isConnecting ? "0" : "0.75rem"
					})`,
					pointerEvents: isConnecting ? "auto" : "none",
				}}
			>
				<div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-sm">
					<span className="relative flex size-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pending opacity-75" />
						<span className="relative inline-flex size-2 rounded-full bg-pending" />
					</span>

					<span className="text-xs font-medium text-muted-foreground">
						Connecting...
					</span>
				</div>
			</div>
		</SocketContext.Provider>
	);
};

export default SocketProvider;
