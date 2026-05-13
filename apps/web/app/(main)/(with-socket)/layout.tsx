import { PropsWithChildren, Suspense } from "react";
import Navbar from "@/components/nav/Navbar";
import { getSession } from "@/lib/session";
import WithSocketProviders from "./providers";

export default async function WithBalanceLayout({
	children,
}: PropsWithChildren) {
	const sessionPromise = getSession();

	return (
		<WithSocketProviders>
			<header className="bg-background h-16 top-0 sticky z-50">
				<Suspense fallback={<div />}>
					<Navbar sessionPromise={sessionPromise} />
				</Suspense>
			</header>

			{children}
		</WithSocketProviders>
	);
}
