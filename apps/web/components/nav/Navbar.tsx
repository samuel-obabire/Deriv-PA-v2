"use client";

import {
	DerivRequestPayload,
	DerivResponseData,
	DerivSocketEvent,
} from "@repo/deriv";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import SideBar from "./sidebar";

const Balance = () => {
	const [balance, setBalance] = useState(0.0);

	const { socket } = useSocket();

	useEffect(() => {
		if (!socket) return;

		socket.emit(DerivSocketEvent.SubscribeBalance, {
			subscribe: 1,
			balance: 1,
			account: "current",
		} satisfies DerivRequestPayload<"balance">);

		socket.on(
			DerivSocketEvent.Balance,
			({ balance: balanceResponse }: DerivResponseData<"balance">) => {
				setBalance(balanceResponse.balance);
			},
		);
	}, [socket]);

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

const Navbar = () => {
	return (
		<nav className="flex items-center p-2  justify-between gap-8">
			<div className={`lg:hidden`}>
				<SideBar />
			</div>

			<div className={`hidden lg:block`}>
				<div>DerivPay</div>
			</div>

			<Balance />
		</nav>
	);
};

export default Navbar;
