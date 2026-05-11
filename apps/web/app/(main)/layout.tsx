import { PropsWithChildren, Suspense } from "react";
import Navbar from "@/components/nav/Navbar";
import { DesktopSideBar } from "@/components/nav/sidebar";
import ConnectionRefresher from "@/components/providers/ConnectionRefresher";
import SocketProvider from "@/context/SocketProvider";
import TokenProvider from "@/context/TokenProvider";
import { getActiveMemberRole } from "@/lib/role";

export default async function AuditLayout({ children }: PropsWithChildren) {
	const rolePromise = getActiveMemberRole();

	return (
		<TokenProvider>
			<SocketProvider>
				<ConnectionRefresher>
					<div className="lg:grid lg:grid-cols-[300px_1fr]">
						<Suspense fallback={<div />}>
							<DesktopSideBar rolePromise={rolePromise} />
						</Suspense>

						<main>
							<header className="bg-background h-16 top-0 sticky z-50">
								<Suspense fallback={<div />}>
									<Navbar rolePromise={rolePromise} />
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
