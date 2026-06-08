"use client";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatUSD } from "@/utils/formatCurrency";

import { TransferData } from "./types";

type TransferResultProps = {
	transferData: TransferData;
	onReset: () => void;
};

const TransferResult = ({ transferData, onReset }: TransferResultProps) => {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-2 py-4">
				<CheckCircle2 className="h-12 w-12 text-green-500" />
				<h2 className="text-xl font-semibold">Transfer Successful</h2>
				<p className="text-sm text-muted-foreground">
					Your funds have been sent
				</p>
			</div>

			<div className="rounded-lg border border-accent p-4 flex flex-col gap-3">
				<div className="flex justify-between items-center">
					<span className="text-sm text-muted-foreground">Amount</span>
					<span className="text-base font-semibold">
						{formatUSD(transferData.amount)}
					</span>
				</div>
				<Separator />
				<div className="flex justify-between items-center">
					<span className="text-sm text-muted-foreground">To</span>
					<span className="text-sm font-medium">
						{transferData.clientAccount}
					</span>
				</div>
				<Separator />
				<div className="flex justify-between items-center">
					<span className="text-sm text-muted-foreground">Client Name</span>
					<span className="text-sm font-medium">{transferData.clientName}</span>
				</div>
				{transferData.description && (
					<>
						<Separator />
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">Note</span>
							<span className="text-sm font-medium">
								{transferData.description}
							</span>
						</div>
					</>
				)}
			</div>

			<Button size="lg" onClick={onReset}>
				New Transfer
			</Button>
		</div>
	);
};

export default TransferResult;
