"use client";

import type { Transaction } from "@repo/db";
import { TRANSACTION_STATUS } from "@repo/db/enums";
import { Button, Card, DataRenderer, Separator } from "@repo/ui";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { TransactionStatusBadge } from "@/components/ui/transaction-status-badge";
import { transfersApi } from "@/lib/api/transfers";
import ROUTES from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/date";
import { formatUSD } from "@/lib/utils/formatCurrency";

type RecentTransfersProps = {
	transfers: Transaction[];
	orgId: string;
	onTransferCancelled: (transferId: string) => void;
};

const RecentTransfers = ({
	transfers,
	orgId,
	onTransferCancelled,
}: RecentTransfersProps) => {
	const [cancellingId, setCancellingId] = useState<string | null>(null);

	const handleCancel = async (transferId: string) => {
		setCancellingId(transferId);

		try {
			await transfersApi.cancelTransfer(transferId, orgId);
			toast.success("Transfer cancelled");
			onTransferCancelled(transferId);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to cancel transfer",
			);
		} finally {
			setCancellingId(null);
		}
	};

	if (transfers.length === 0) return null;

	return (
		<div className="flex flex-col gap-4">
			<Separator />
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium text-muted-foreground">
					Recent Transfers
				</h3>
				<Button asChild size="sm" variant="ghost" className="gap-1.5">
					<Link href={ROUTES.TRANSFER_HISTORY}>
						Transfer History
						<ArrowRight className="size-3.5" />
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-3">
				<DataRenderer
					data={transfers}
					render={(data) => (
						<>
							{data.map((transfer) => (
								<Card
									key={transfer.id}
									className="flex-row items-center justify-between gap-3 p-3"
								>
									<div className="flex flex-col gap-0.5 min-w-0">
										<span className="text-sm font-medium truncate">
											{transfer.clientName ?? transfer.clientId}
										</span>
										<span className="text-xs text-muted-foreground">
											{formatDate(transfer.createdAt)}
										</span>
									</div>

									<div className="flex items-center gap-2 shrink-0 ml-3">
										<span className="text-sm font-semibold">
											{formatUSD(transfer.amount)} {transfer.currency}
										</span>

										<TransactionStatusBadge status={transfer.status} />

										{transfer.status === TRANSACTION_STATUS.PENDING && (
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
												disabled={cancellingId === transfer.id}
												onClick={() => handleCancel(transfer.id)}
											>
												<X className="h-4 w-4" />
												<span className="sr-only">Cancel transfer</span>
											</Button>
										)}
									</div>
								</Card>
							))}
						</>
					)}
				/>
			</div>
		</div>
	);
};

export default RecentTransfers;
