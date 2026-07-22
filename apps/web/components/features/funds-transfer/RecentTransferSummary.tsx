import type { DuplicateTransferDetails } from "@repo/deriv";
import { Card } from "@repo/ui";
import { TransactionStatusBadge } from "@/components/ui/transaction-status-badge";
import { formatDate } from "@/lib/utils/date";
import { formatUSD } from "@/lib/utils/formatCurrency";

type RecentTransferSummaryProps = {
	transfer: DuplicateTransferDetails["recentTransfer"];
};

const RecentTransferSummary = ({ transfer }: RecentTransferSummaryProps) => {
	return (
		<Card className="flex-row items-center justify-between gap-3 p-3">
			<div className="flex flex-col gap-0.5 min-w-0">
				<span className="text-sm font-medium truncate">
					{transfer.clientName || transfer.clientId}
				</span>
				<span className="text-xs text-muted-foreground">
					{formatDate(new Date(transfer.createdAt))}
				</span>
			</div>

			<div className="flex items-center gap-2 shrink-0 ml-3">
				<span className="text-sm font-semibold">
					{formatUSD(transfer.amount)} {transfer.currency}
				</span>

				<TransactionStatusBadge status={transfer.status} />
			</div>
		</Card>
	);
};

export default RecentTransferSummary;
