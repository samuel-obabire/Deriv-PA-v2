"use client";

import type { Transaction } from "@repo/db";
import { TRANSACTION_STATUS } from "@repo/db/enums";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { transfersApi } from "@/lib/api/transfers";
import { formatDate } from "@/utils/date";
import { formatUSD } from "@/utils/formatCurrency";

type BadgeVariant =
	| "outline"
	| "default"
	| "matched"
	| "destructive"
	| "secondary";

const STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
	[TRANSACTION_STATUS.PENDING]: "outline",
	[TRANSACTION_STATUS.PROCESSING]: "default",
	[TRANSACTION_STATUS.COMPLETED]: "matched",
	[TRANSACTION_STATUS.FAILED]: "destructive",
	[TRANSACTION_STATUS.CANCELLED]: "secondary",
};

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
			<h3 className="text-sm font-medium text-muted-foreground">
				Recent Transfers
			</h3>

			<div className="flex flex-col gap-3">
				{transfers.map((transfer) => (
					<div
						key={transfer.id}
						className="flex items-center justify-between rounded-lg border border-accent p-3"
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

							<Badge
								variant={STATUS_BADGE_VARIANT[transfer.status] ?? "outline"}
							>
								{transfer.status}
							</Badge>

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
					</div>
				))}
			</div>
		</div>
	);
};

export default RecentTransfers;
