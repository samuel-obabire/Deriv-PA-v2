"use client";

import type { Rate } from "@repo/db";
import { Spinner } from "@repo/ui";
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
				<Spinner className="size-6" />
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
					<Spinner />
				</div>
			)}
		</div>
	);
};

export default Statement;
