import { getAllOrganizationCurrencies } from "@repo/db/queries";
import { SettingsIcon, WalletIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import ConnectionRefresher from "@/components/providers/ConnectionRefresher";
import EmptyState from "@/components/ui/empty-state";
import CurrencyProvider from "@/context/CurrencyProvider";
import SocketProvider from "@/context/SocketProvider";
import TokenProvider from "@/context/TokenProvider";
import ROUTES from "@/lib/constants/routes";
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

	if (currencyList.length === 0) {
		return (
			<div className="container flex min-h-[60vh] items-center justify-center">
				<EmptyState
					icon={<WalletIcon className="size-6 text-muted-foreground" />}
					title="No currencies configured"
					description="Add a Deriv token to enable currency management for your organization."
					href={ROUTES.DERIV_TOKENS}
					linkIcon={<SettingsIcon className="size-4" />}
					linkLabel="Token settings"
				/>
			</div>
		);
	}

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
