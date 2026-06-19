"use client";

import { use } from "react";
import { Session } from "@/lib/auth";
import SideBar from "./sidebar";

const NavbarSlim = ({
	sessionPromise,
}: {
	sessionPromise: Promise<Session | null>;
}) => {
	const session = use(sessionPromise);

	if (!session) return null;

	return (
		<nav className="flex items-center p-2 justify-between gap-8">
			<div className="lg:hidden">
				<SideBar role={session.user.role} user={session.user} />
			</div>

			<div className="hidden lg:block">
				<div>DerivPay</div>
			</div>
		</nav>
	);
};

export default NavbarSlim;
