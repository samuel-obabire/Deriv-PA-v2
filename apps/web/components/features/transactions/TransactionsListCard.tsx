import { Rate, Transaction } from "@repo/db";
import { Card, CardContent, CardHeader } from "@repo/ui";
import { TransactionStatusBadge } from "@/components/ui/transaction-status-badge";
import { getTZDate } from "@/lib/utils/date";
import {
	calculateNairaEquivalent,
	formatAmount,
	formatNairaValue,
} from "@/lib/utils/statement";

type TransactionsListCardProps = {
	transaction: Transaction;
	rate: Rate;
};

const TransactionsListCard = ({
	transaction,
	rate,
}: TransactionsListCardProps) => {
	const { amount, createdAt, currency, clientName, clientId, status, type } =
		transaction;
	const formatedDate = getTZDate(createdAt);

	const nairaEquivalent = calculateNairaEquivalent(Number(amount), type, rate);

	return (
		<div className="flex flex-col items-center">
			<Card className="w-full max-w-175">
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between">
						<div className="min-w-0">
							<p className="font-medium truncate">{clientName || clientId}</p>
							{clientName && (
								<p className="text-xs text-muted-foreground truncate">
									{clientId}
								</p>
							)}
						</div>
						<TransactionStatusBadge status={status} />
					</div>
				</CardHeader>
				<CardContent className="space-y-1.5">
					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="text-muted-foreground">Date</span>
						<span>{formatedDate}</span>
					</div>

					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="text-muted-foreground">Amount</span>
						<span className="font-semibold">
							-{formatAmount(Number(amount), currency)}
						</span>
					</div>

					{nairaEquivalent !== null && (
						<div className="flex items-center justify-between text-xs sm:text-sm">
							<span className="text-muted-foreground">Naira Equivalent</span>
							<span>{formatNairaValue(nairaEquivalent)}</span>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default TransactionsListCard;
