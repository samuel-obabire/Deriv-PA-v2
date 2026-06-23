"use client";

import { WsAuthError } from "@repo/utils";
import {
	createContext,
	ReactNode,
	useEffect,
	useRef,
	useState,
	useTransition,
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
	connectedAccessToken: string | null;
	isPending: boolean;
	isConnecting: boolean;
	isSocketBusy: () => boolean;
} | null>(null);

const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketClient, setSocketClient] = useState<SocketClient | null>(null);
	const [connectedAccessToken, setConnectedAccessToken] = useState<
		string | null
	>(null);
	const [isPending, startTransition] = useTransition();
	const [isConnecting, setIsConnecting] = useState(false);

	const instanceRef = useRef<Socket | null>(null);
	const clientRef = useRef<SocketClient | null>(null);
	const tokenRef = useRef<string | null>(null);

	const { accessToken, isPending: isTokenRefreshing } = useAccessToken();

	// Keep tokenRef current so the auth callback always sends the latest token,
	// even on socket.io's internal reconnect attempts.
	tokenRef.current = accessToken;

	// Create a single socket instance for the lifetime of this provider.
	// autoConnect: false — we connect manually once we have a token.
	// auth callback — called on every connect/reconnect attempt, always picks up
	// the latest token from the ref so we never reconnect with a stale token.
	useEffect(() => {
		const instance = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			auth: (cb) => cb({ accessToken }),
			transports: ["websocket"],
			autoConnect: false,
		});

		instanceRef.current = instance;

		const handleConnect = () => {
			const client = new SocketClient(instance);
			clientRef.current = client;

			client
				.authorize({ authorize: "" })
				.then(() => {
					// Guard against a reconnect cycle that superseded this client
					// while authorize was in-flight.
					if (clientRef.current !== client) return;
					setIsConnecting(false);
					startTransition(() => {
						setSocket(instance);
						setSocketClient(client);
						setConnectedAccessToken(accessToken);
					});
				})
				.catch(() => {
					setIsConnecting(false);
					instance.disconnect();
				});
		};

		const handleDisconnect = () => {
			clientRef.current?.dispose();
			clientRef.current = null;

			setSocket(null);
			setSocketClient(null);
			setConnectedAccessToken(null);
		};

		const handleConnectError = (err: Error) => {
			// Permanently stop retrying only for server-side auth rejections.
			// Network errors are retried automatically by socket.io's backoff.
			if (
				err.message === WsAuthError.MissingAuthParams ||
				err.message === WsAuthError.AccessDenied ||
				err.message === WsAuthError.InvalidToken
			) {
				setIsConnecting(false);
				instance.disconnect();
			}
		};

		// Socket.io fires this on every internal reconnect attempt so we can
		// re-show the indicator after a disconnect while the manager retries.
		const handleReconnectAttempt = () => setIsConnecting(true);

		instance.on("connect", handleConnect);
		instance.on("disconnect", handleDisconnect);
		instance.on("connect_error", handleConnectError);
		instance.io.on("reconnect_attempt", handleReconnectAttempt);

		return () => {
			instance.disconnect();
			instance.removeAllListeners();
			instance.io.off("reconnect_attempt", handleReconnectAttempt);
			instanceRef.current = null;
		};
	}, [accessToken]);

	// Connect when a token first becomes available, or reconnect when the token
	// changes and socket.io has stopped retrying (e.g. after an auth rejection).
	// If socket.io is already in its retry loop (instance.active === true),
	// we skip the explicit connect — the next attempt will pick up the new token
	// from tokenRef automatically via the auth callback.
	useEffect(() => {
		if (isTokenRefreshing) return;

		const instance = instanceRef.current;
		if (!accessToken || !instance) return;
		if (!instance.connected && !instance.active) {
			setIsConnecting(true);
			instance.connect();
		}
	}, [accessToken, isTokenRefreshing]);

	// Reads live from the ref so it never triggers re-renders.
	// Returns true when socket.io is connected or actively trying to connect/reconnect,
	// meaning a token refresh is not needed to unblock the connection.
	const isSocketBusy = () => {
		const instance = instanceRef.current;
		return Boolean(instance?.connected || instance?.active);
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				socketClient,
				connectedAccessToken,
				isPending,
				isConnecting,
				isSocketBusy,
			}}
		>
			{children}
			<div
				className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
				style={{
					opacity: isConnecting ? 1 : 0,
					transform: `translateX(-50%) translateY(${isConnecting ? "0" : "0.75rem"})`,
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
