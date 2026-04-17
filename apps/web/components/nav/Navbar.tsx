import { ChevronDown } from "lucide-react";
import Image from "next/image";
import SideBar from "./sidebar";

const Balance = () => {
	return (
		<div className="flex gap-3">
			<Image
				src="/asset/svg/USD.svg"
				alt="active-currency"
				width={24.85}
				height={5.15}
			/>

			<div className="flex gap-2 items-center">
				<div className="flex flex-col">
					<span className="text-accent-foreground">Real</span>
					<span className="text-success text-bold">$48,980.90</span>
				</div>

				<ChevronDown />
			</div>
		</div>
	);
};

const MobileNav = () => {
	return (
		<>
			<SideBar />

			<Balance />
		</>
	);
};

const DesktopNav = () => {
	return (
		<>
			<div>DerivPay</div>
			<Balance />
		</>
	);
};

const Navbar = () => {
	const sharedClassName = "items-center p-2  justify-between gap-8";

	return (
		<nav>
			<div className={`flex lg:hidden ${sharedClassName}`}>
				<MobileNav />
			</div>

			<div className={`hidden lg:flex ${sharedClassName}`}>
				<DesktopNav />
			</div>
		</nav>
	);
};

export default Navbar;
