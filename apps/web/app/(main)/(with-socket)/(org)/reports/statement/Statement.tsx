"use client";

import type { Rate } from "@repo/db";
import { Loader2 } from "lucide-react";
import useStatementOptions from "@/hooks/useStatementOptions";
import StatementCard from "./StatementCard";

type Props = {
	rate: Rate;
};

const Statement = ({ rate }: Props) => {
	const {
		transactions,
		isLoading,
		sentinelRef,
		currency,
		isConnecting,
		isEmpty,
	} = useStatementOptions();

	if ((isConnecting || isLoading) && transactions.length === 0) {
		return (
			<div className="mt-8 flex justify-center">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isEmpty) {
		return (
			<div className="mt-4 text-center text-muted-foreground">
				No transactions found.
			</div>
		);
	}

	return (
		<div>
			{transactions.map((transaction) => (
				<StatementCard
					key={transaction.transaction_id}
					rate={rate}
					transaction={transaction}
					currency={currency as string}
				/>
			))}

			<div className="h-4" ref={sentinelRef} />

			{(isLoading || isConnecting) && transactions.length > 0 && (
				<div className="mt-4 flex justify-center py-2">
					<Loader2 className="size-4 animate-spin text-muted-foreground" />
				</div>
			)}
		</div>
	);
};

export default Statement;
