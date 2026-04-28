import { PropsWithChildren } from "react";
import Navbar from "@/components/nav/Navbar";
import { DesktopSideBar } from "@/components/nav/sidebar";
import SocketProvider from "@/context/SocketProvider";

export default function AuditLayout({ children }: PropsWithChildren) {
	const tokenId = "token-1";
	const orgId = "1";

	return (
		<SocketProvider orgId={orgId} tokenId={tokenId}>
			<div className="lg:grid lg:grid-cols-[300px_1fr]">
				<DesktopSideBar />

				<main>
					<header className="bg-background h-16 top-0 sticky z-50">
						<Navbar />
					</header>

					{children}
				</main>
			</div>
		</SocketProvider>
	);
}
