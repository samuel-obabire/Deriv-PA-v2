import { PropsWithChildren } from "react";
import Navbar from "@/components/nav/Navbar";
import { DesktopSideBar } from "@/components/nav/sidebar";
import ConnectionRefresher from "@/components/providers/ConnectionRefresher";
import SocketProvider from "@/context/SocketProvider";
import TokenProvider from "@/context/TokenProvider";

export default function AuditLayout({ children }: PropsWithChildren) {
	return (
		<TokenProvider>
			<SocketProvider>
				<ConnectionRefresher>
					<div className="lg:grid lg:grid-cols-[300px_1fr]">
						<DesktopSideBar />

						<main>
							<header className="bg-background h-16 top-0 sticky z-50">
								<Navbar />
							</header>

							{children}
						</main>
					</div>
				</ConnectionRefresher>
			</SocketProvider>
		</TokenProvider>
	);
}
