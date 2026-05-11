import { PropsWithChildren, Suspense } from "react";
import Navbar from "@/components/nav/Navbar";
import { DesktopSideBar } from "@/components/nav/sidebar";
import ConnectionRefresher from "@/components/providers/ConnectionRefresher";
import SocketProvider from "@/context/SocketProvider";
import TokenProvider from "@/context/TokenProvider";
import { getSession } from "@/lib/session";

export default async function AuditLayout({ children }: PropsWithChildren) {
	const sessionPromise = getSession();

	return (
		<TokenProvider>
			<SocketProvider>
				<ConnectionRefresher>
					<div className="lg:grid lg:grid-cols-[300px_1fr]">
						<Suspense fallback={<div />}>
							<DesktopSideBar sessionPromise={sessionPromise} />
						</Suspense>

						<main>
							<header className="bg-background h-16 top-0 sticky z-50">
								<Suspense fallback={<div />}>
									<Navbar sessionPromise={sessionPromise} />
								</Suspense>
							</header>

							{children}
						</main>
					</div>
				</ConnectionRefresher>
			</SocketProvider>
		</TokenProvider>
	);
}
