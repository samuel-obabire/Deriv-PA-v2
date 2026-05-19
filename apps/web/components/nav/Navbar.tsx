"use client";

import { RoleNames } from "@/lib/permissions";
import CurrencySwitcher from "./CurrencySwitcher";
import SideBar from "./sidebar";

const Navbar = ({ role }: { role: RoleNames }) => {
	return (
		<nav className="flex items-center p-2  justify-between gap-8">
			<div className={`lg:hidden`}>
				<SideBar role={role} />
			</div>

			<div className={`hidden lg:block`}>
				<div>DerivPay</div>
			</div>

			<CurrencySwitcher />
		</nav>
	);
};

export default Navbar;
