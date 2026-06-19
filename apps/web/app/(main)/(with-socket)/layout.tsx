import { PropsWithChildren, Suspense } from "react";
import Navbar from "@/components/nav/Navbar";
import { verifySession } from "@/lib/session";
import WithSocketProviders from "./providers";

const headerClassName = "bg-background h-16 top-0 sticky z-50";

const LayoutHeader = async () => {
	const session = await verifySession();

	return <Navbar role={session.user.role} user={session.user} />;
};

export default function WithBalanceLayout({ children }: PropsWithChildren) {
	return (
		<WithSocketProviders>
			<header className={headerClassName}>
				<Suspense fallback={<div />}>
					<LayoutHeader />
				</Suspense>
			</header>

			{children}
		</WithSocketProviders>
	);
}
