"use client";

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
	isPending: boolean;
} | null>(null);

const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketClient, setSocketClient] = useState<SocketClient | null>(null);
	const [isPending, startTransition] = useTransition();

	const instanceRef = useRef<Socket | null>(null);
	const clientRef = useRef<SocketClient | null>(null);
	const tokenRef = useRef<string | null>(null);

	const { accessToken } = useAccessToken();

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
					startTransition(() => {
						setSocket(instance);
						setSocketClient(client);
					});
				})
				.catch(() => {
					instance.disconnect();
				});
		};

		const handleDisconnect = () => {
			clientRef.current?.dispose();
			clientRef.current = null;
			// startTransition(() => {
			setSocket(null);
			setSocketClient(null);
			// });
		};

		const handleConnectError = (err: Error) => {
			// Permanently stop retrying only for server-side auth rejections.
			// Network errors are retried automatically by socket.io's backoff.
			if (
				err.message === "Missing auth params" ||
				err.message === "Access denied"
			) {
				instance.disconnect();
			}
		};

		instance.on("connect", handleConnect);
		instance.on("disconnect", handleDisconnect);
		instance.on("connect_error", handleConnectError);

		return () => {
			instance.disconnect();
			instance.removeAllListeners();
			instanceRef.current = null;
		};
	}, [accessToken]);

	// Connect when a token first becomes available, or reconnect when the token
	// changes and socket.io has stopped retrying (e.g. after an auth rejection).
	// If socket.io is already in its retry loop (instance.active === true),
	// we skip the explicit connect — the next attempt will pick up the new token
	// from tokenRef automatically via the auth callback.
	useEffect(() => {
		const instance = instanceRef.current;
		if (!accessToken || !instance) return;
		if (!instance.connected && !instance.active) {
			instance.connect();
		}
	}, [accessToken]);

	return (
		<SocketContext.Provider value={{ socket, socketClient, isPending }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
