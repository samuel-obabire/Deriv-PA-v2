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

	const clientRef = useRef<SocketClient | null>(null);

	const { accessToken } = useAccessToken();

	useEffect(() => {
		const instance = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			auth: (cb) => cb({ accessToken }),
			transports: ["websocket"],
			autoConnect: false,
		});

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
			startTransition(() => {
				setSocket(null);
				setSocketClient(null);
			});
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

		if (accessToken) instance.connect();

		return () => {
			instance.disconnect();
			instance.removeAllListeners();
		};
	}, [accessToken]);

	return (
		<SocketContext.Provider value={{ socket, socketClient, isPending }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
