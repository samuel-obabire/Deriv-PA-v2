"use client";

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
} | null>(null);

const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketClient, setSocketClient] = useState<SocketClient | null>(null);

	const socketRef = useRef<Socket | null>(null);
	const clientRef = useRef<SocketClient | null>(null);

	const { accessToken } = useAccessToken();

	const connectSocket = useCallback((token: string) => {
		const newSocket = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			auth: { accessToken: token },
			transports: ["websocket"],
		});

		socketRef.current = newSocket;

		const handleConnect = async () => {
			setSocket(newSocket);

			const client = clientRef.current ?? new SocketClient(newSocket);

			clientRef.current = client;

			try {
				await client.authorize({ authorize: "" });
				setSocketClient(client);
			} catch {
				newSocket.disconnect();
			}
		};

		const handleReconnect = async () => {
			try {
				await clientRef.current?.authorize({ authorize: "" });
			} catch {
				newSocket.disconnect();
			}
		};

		const handleDisconnect = () => {
			setSocket(null);
			setSocketClient(null);
			socketRef.current = null;
			clientRef.current = null;
		};

		newSocket.on("connect", handleConnect);
		newSocket.io.on("reconnect", handleReconnect);
		newSocket.on("disconnect", handleDisconnect);

		newSocket.on("connect_error", () => {
			newSocket.disconnect();
		});

		return newSocket;
	}, []);

	useEffect(() => {
		if (!accessToken) return;

		const socketInstance = connectSocket(accessToken);

		return () => {
			socketInstance.disconnect();
		};
	}, [accessToken, connectSocket]);

	return (
		<SocketContext.Provider value={{ socket, socketClient }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
