"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
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
	reconnectSocket: (accessToken: string) => void;
} | null>(null);

const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketClient, setSocketClient] = useState<SocketClient | null>(null);

	const { accessToken } = useAccessToken();

	const reconnectSocket = (accessToken: string) => {
		connectSocket(accessToken);
	};

	const connectSocket = useCallback((accessToken: string) => {
		const newSocket = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			auth: {
				accessToken: accessToken,
			},
			transports: ["websocket"],
		});

		newSocket.on("connect", async () => {
			const socketClient = new SocketClient(newSocket);

			await socketClient.authorize({ authorize: "" });

			setSocket(newSocket);
			setSocketClient(socketClient);
		});

		newSocket.on("connect_error", (err) => {
			console.error("socket error:", err.message);
		});

		newSocket.on("disconnect", () => {
			setSocket(null);
			setSocketClient(null);
		});

		return newSocket;
	}, []);

	useEffect(() => {
		if (!accessToken) return;

		const newSocket = connectSocket(accessToken);

		return () => {
			newSocket.disconnect();
		};
	}, [accessToken, connectSocket]);

	return (
		<SocketContext.Provider value={{ socket, socketClient, reconnectSocket }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
