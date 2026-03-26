"use client";

import { PropsWithChildren } from "react";
import Logout from "@/components/auth/Logout";

export default function AuditLayout({ children }: PropsWithChildren) {
	return (
		<>
			<header className="w-full top-0 sticky z-50">
				<div className="flex justify-between items-center w-full px-6 py-4">
					<h1 className="font-space font-bold  text-xl  text-pending tracking-widest uppercase">
						DerivPay
					</h1>

					<Logout />
				</div>
			</header>

			<main>{children}</main>
		</>
	);
}
