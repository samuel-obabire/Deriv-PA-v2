import { Rate, Transaction } from "@repo/db";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "@repo/db/enums";
import { Button, Card, CardContent, CardHeader, Copy } from "@repo/ui";
import Link from "next/link";
import { TransactionStatusBadge } from "@/components/ui/transaction-status-badge";
import ROUTES from "@/lib/constants/routes";
import { getTZDate } from "@/lib/utils/date";
import {
	calculateNairaEquivalent,
	formatAmount,
	formatNairaValue,
} from "@/lib/utils/statement";

const UNSETTLED_STATUSES: string[] = [TRANSACTION_STATUS.PROCESSING];

type TransactionsListCardProps = {
	transaction: Transaction;
	rate: Rate;
};

const TransactionsListCard = ({
	transaction,
	rate,
}: TransactionsListCardProps) => {
	const {
		amount,
		ngnAmount,
		createdAt,
		currency,
		clientName,
		clientId,
		notes,
		status,
		type,
		depositRate,
	} = transaction;
	const formatedDate = getTZDate(createdAt);

	const nairaEquivalent =
		Number(ngnAmount) ||
		calculateNairaEquivalent(Number(amount), type, rate, depositRate);

	return (
		<div className="flex flex-col items-center">
			<Card className="w-full max-w-175">
				<CardHeader className="pb-2">
					<div className="flex min-w-0 items-start justify-between">
						<div className="min-w-0">
							{clientName ? (
								<p className="font-medium truncate">{clientName}</p>
							) : (
								<Copy value={clientId} className="min-w-0">
									<span className="truncate font-medium">{clientId}</span>
								</Copy>
							)}
							{clientName && (
								<Copy
									value={clientId}
									className="min-w-0 text-xs text-muted-foreground"
								>
									<span className="truncate">{clientId}</span>
								</Copy>
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

					{notes && (
						<div className="flex min-w-0 items-center justify-between gap-2 text-xs sm:text-sm">
							<span className="shrink-0 text-muted-foreground">Narration</span>
							<span className="truncate text-right">{notes}</span>
						</div>
					)}

					{type === TRANSACTION_TYPE.WITHDRAWAL &&
						UNSETTLED_STATUSES.includes(status) && (
							<Button asChild variant="link" size="sm" className="h-auto p-0">
								<Link href={`${ROUTES.TRANSFER_STATUS}?id=${transaction.id}`}>
									Check status
								</Link>
							</Button>
						)}
				</CardContent>
			</Card>
		</div>
	);
};

export default TransactionsListCard;
