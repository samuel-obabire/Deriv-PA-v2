"use client";

import { PropsWithChildren } from "react";
import Navbar from "@/components/nav/Navbar";
import { DesktopSideBar } from "@/components/nav/sidebar";

export default function AuditLayout({ children }: PropsWithChildren) {
	return (
		<div className="lg:grid lg:grid-cols-[300px_1fr]">
			<DesktopSideBar />

			<main>
				<header className="bg-background h-16 top-0 sticky z-50">
					<Navbar />
				</header>

				{children}
			</main>
		</div>
	);
}
