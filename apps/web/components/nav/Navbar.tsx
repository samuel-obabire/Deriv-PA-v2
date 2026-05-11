"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { Session } from "@/lib/auth";
import SideBar from "./sidebar";

const Balance = () => {
	const [balance, setBalance] = useState(0.0);

	const { socket, socketClient } = useSocket();

	useEffect(() => {
		if (!socket || !socketClient) return;

		(async () => {
			await socketClient.subscribeBalance((data) => {
				setBalance(data.balance.balance);
			});
		})();
	}, [socket, socketClient]);

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
					<span className="text-success text-bold">{balance}</span>
				</div>

				<ChevronDown />
			</div>
		</div>
	);
};

const Navbar = ({
	sessionPromise,
}: {
	sessionPromise: Promise<Session | null>;
}) => {
	const session = use(sessionPromise);

	if (!session) return null;

	return (
		<nav className="flex items-center p-2  justify-between gap-8">
			<div className={`lg:hidden`}>
				<SideBar role={session.user.role} />
			</div>

			<div className={`hidden lg:block`}>
				<div>DerivPay</div>
			</div>

			<Balance />
		</nav>
	);
};

export default Navbar;
