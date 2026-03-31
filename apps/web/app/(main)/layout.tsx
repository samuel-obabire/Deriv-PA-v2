"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import Logout from "@/components/auth/Logout";
import Navbar from "@/components/nav/Navbar";
import ROUTES from "@/lib/constants/routes";

export default function AuditLayout({ children }: PropsWithChildren) {
	return (
		<>
			<header className="w-full bg-background h-16 top-0 sticky z-50">
				<div className="flex justify-between items-center w-full px-6 py-4">
					<Link href={ROUTES.HOME}>
						<h1 className="font-space font-bold  text-xl  text-pending tracking-widest uppercase">
							DerivPay
						</h1>
					</Link>

					<Navbar />

					<Logout />
				</div>
			</header>

			<main>{children}</main>
		</>
	);
}
