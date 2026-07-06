"use client";

import { User } from "@/lib/auth";
import { RoleNames } from "@/lib/permissions";
import CurrencySwitcher from "./CurrencySwitcher";
import SideBar from "./sidebar";

const Navbar = ({ role, user }: { role: RoleNames; user: User }) => {
	return (
		<nav className="flex h-full items-center px-4 gap-4">
			<div className="lg:hidden">
				<SideBar role={role} user={user} />
			</div>

			<div className="ml-auto">
				<CurrencySwitcher />
			</div>
		</nav>
	);
};

export default Navbar;
