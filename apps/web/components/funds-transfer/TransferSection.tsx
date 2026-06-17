"use client";

import type { Rate, Transaction } from "@repo/db";
import useRecentTransfers from "@/hooks/useRecentTransfers";
import RecentTransfers from "./RecentTransfers";
import TransferToClient from "./TransferToClient";

type TransferSectionProps = {
	rate: Rate;
	orgId: string;
	initialTransfers: Transaction[];
};

const TransferSection = ({
	rate,
	orgId,
	initialTransfers,
}: TransferSectionProps) => {
	const { transfers, addTransfer, onTransferCancelled } =
		useRecentTransfers(initialTransfers);

	return (
		<div className="w-full max-w-112.5 mx-auto flex flex-col gap-36">
			<TransferToClient rate={rate} onTransferSuccess={addTransfer} />
			<RecentTransfers
				transfers={transfers}
				orgId={orgId}
				onTransferCancelled={onTransferCancelled}
			/>
		</div>
	);
};

export default TransferSection;
