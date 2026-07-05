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
		<nav className="flex h-full items-center px-4">
			<div className="lg:hidden">
				<SideBar role={session.user.role} user={session.user} />
			</div>
		</nav>
	);
};

export default NavbarSlim;
