"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { CURRENCY_ICON } from "@/lib/utils/deriv";
import { formatUSD } from "@/utils/formatCurrency";

const Balance = ({ currency }: { currency: string | null }) => {
	const [balance, setBalance] = useState<number | null>(null);

	const { socket, socketClient, isPending } = useSocket();

	const fn = useCallback(async () => {
		if (!socket || !socketClient) return;

		await socketClient.subscribeBalance((data) => {
			setBalance(data.balance.balance);
		});
	}, [socketClient, socket]);

	useEffect(() => {
		fn();
	}, [fn]);

	const iconSrc =
		CURRENCY_ICON[currency as keyof typeof CURRENCY_ICON] ??
		CURRENCY_ICON.DEFAULT;

	return (
		<div className="flex gap-3">
			<Image
				src={iconSrc}
				alt={currency ?? "USD"}
				width={24.85}
				height={5.15}
			/>

			<div className="flex gap-2 items-center">
				<div className="flex flex-col">
					<span className="text-accent-foreground">Real</span>
					{isPending || balance === null ? (
						<span className="h-4 w-20 animate-pulse rounded bg-muted" />
					) : (
						<span className="text-success text-bold">{formatUSD(balance)}</span>
					)}
				</div>

				<ChevronDown />
			</div>
		</div>
	);
};

export default Balance;
