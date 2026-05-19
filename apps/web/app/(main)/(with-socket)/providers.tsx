import { getAllOrganizationCurrencies } from "@repo/db/queries";
import { PropsWithChildren } from "react";
import ConnectionRefresher from "@/components/providers/ConnectionRefresher";
import CurrencyProvider from "@/context/CurrencyProvider";
import SocketProvider from "@/context/SocketProvider";
import TokenProvider from "@/context/TokenProvider";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

export default async function WithSocketProviders({
	children,
}: PropsWithChildren) {
	const session = await verifySession();

	const currencyList = await getAllOrganizationCurrencies(
		session.session.activeOrganizationId as string,
		db,
	);

	return (
		<CurrencyProvider currencyList={currencyList}>
			<TokenProvider>
				<SocketProvider>
					<ConnectionRefresher>{children}</ConnectionRefresher>
				</SocketProvider>
			</TokenProvider>
		</CurrencyProvider>
	);
}
