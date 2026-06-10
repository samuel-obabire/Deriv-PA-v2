"use client";

import type { Rate } from "@repo/db";
import type { StatementActionType } from "@repo/deriv";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import useStatementList from "@/hooks/useStatementList";

import StatementCard from "./StatementCard";

type Props = {
	rate: Rate;
};

const Statement = ({ rate }: Props) => {
	const searchParams = useSearchParams();
	const statementType = (searchParams.get("type") ?? undefined) as
		| StatementActionType
		| undefined;

	const {
		transactions,
		isLoading,
		sentinelRef,
		currency,
		isConnecting,
		isEmpty,
	} = useStatementList({ statementType });

	if (isConnecting || (isLoading && transactions.length === 0)) {
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

			{isLoading && transactions.length > 0 && (
				<div className="mt-4 flex justify-center py-2">
					<Loader2 className="size-4 animate-spin text-muted-foreground" />
				</div>
			)}
		</div>
	);
};

export default Statement;
