"use client";

import { PropsWithChildren } from "react";
import ConnectionRefresher from "@/components/providers/ConnectionRefresher";
import SocketProvider from "@/context/SocketProvider";
import TokenProvider from "@/context/TokenProvider";

export default function WithSocketProviders({ children }: PropsWithChildren) {
	return (
		<TokenProvider>
			<SocketProvider>
				<ConnectionRefresher>{children}</ConnectionRefresher>
			</SocketProvider>
		</TokenProvider>
	);
}
