"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import SocketClient from "@/lib/socketClient";
import { clientEnv } from "@/lib/validations/env/client";

type SocketProviderProps = {
	orgId: string;
	children: ReactNode;
	tokenId: string;
};

export const SocketContext = createContext<{
	socket: Socket | null;
	socketClient: SocketClient | null;
} | null>(null);

const SocketProvider = ({ orgId, children, tokenId }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketClient, setSocketClient] = useState<SocketClient | null>(null);

	useEffect(() => {
		const newSocket = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			auth: {
				organizationId: orgId,
				userId: 1,
				tokenId: tokenId,
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

		return () => {
			newSocket.disconnect();
		};
	}, [tokenId, orgId]);

	return (
		<SocketContext.Provider value={{ socket, socketClient }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
