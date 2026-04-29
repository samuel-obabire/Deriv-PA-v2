"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketResponse } from "@/lib/types/global";
import { clientEnv } from "@/lib/validations/env/client";

type SocketProviderProps = {
	orgId: string;
	children: ReactNode;
	tokenId: string;
};

export const SocketContext = createContext<{ socket: Socket | null } | null>(
	null,
);

const SocketProvider = ({ orgId, children, tokenId }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
			auth: {
				organizationId: orgId,
				userId: 1,
				tokenId: tokenId,
			},
			transports: ["websocket"],
		});

		newSocket.on("connect", () => {
			newSocket.emit("authorize", (response: SocketResponse) => {
				if (!response.success) {
					newSocket.disconnect();
					return;
				}

				setSocket(newSocket);
			});
		});

		newSocket.on("connect_error", (err) => {
			console.error("socket error:", err.message);
		});

		newSocket.on("disconnect", () => {
			setSocket(null);
		});

		return () => {
			newSocket.disconnect();
			setSocket(null);
		};
	}, [tokenId, orgId]);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
