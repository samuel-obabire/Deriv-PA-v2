"use client";

import { Button, Card } from "@repo/ui";
import { formatAmountInput, formatUSD } from "@/lib/utils/formatCurrency";
import { TransferData } from "./types";

type TransferDetailsProps = {
	data: TransferData;
	isPending: boolean;
	onBack: () => void;
	onProceed: () => void;
	currency: string;
};

const TransferDetails = ({
	data,
	isPending,
	onBack,
	onProceed,
	currency,
}: TransferDetailsProps) => {
	return (
		<div className="flex flex-col gap-6">
			<Card className="p-6 text-center">
				<p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
					Transfer Amount
				</p>
				<p className="text-5xl font-bold tracking-tight">
					₦ {formatAmountInput(data.ngnAmount)}
				</p>
				<p className="text-lg font-medium text-muted-foreground mt-1">
					{formatUSD(data.amount)} {currency}
				</p>
			</Card>

			<Card className="gap-0 py-0">
				<div className="flex items-center justify-between px-4 py-3">
					<span className="text-sm text-muted-foreground">To Account</span>
					<span className="text-sm font-medium">{data.clientAccount}</span>
				</div>

				<div className="flex items-center justify-between px-4 py-3">
					<span className="text-sm text-muted-foreground">Client Name</span>
					<span className="text-sm font-medium">{data.clientName}</span>
				</div>

				{data.description && (
					<div className="flex items-start justify-between px-4 py-3 gap-4">
						<span className="text-sm text-muted-foreground shrink-0">
							Description
						</span>
						<span className="text-sm font-medium text-right">
							{data.description}
						</span>
					</div>
				)}
			</Card>

			<p className="text-xs text-muted-foreground text-center">
				Please review the details above before confirming.
			</p>

			<div className="flex gap-3">
				<Button
					disabled={isPending}
					variant="outline"
					size="lg"
					className="flex-1"
					onClick={onBack}
				>
					Go Back
				</Button>
				<Button
					disabled={isPending}
					size="lg"
					className="flex-1"
					onClick={onProceed}
				>
					Confirm Transfer
				</Button>
			</div>
		</div>
	);
};

export default TransferDetails;
