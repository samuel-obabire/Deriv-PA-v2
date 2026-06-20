"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ROUTES from "@/lib/constants/routes";
import { formatUSD } from "@/utils/formatCurrency";
import { TransferData } from "./types";

type TransferResultProps = {
	transferData: TransferData;
	currency: string;
	onReset: () => void;
};

const TransferResult = ({
	transferData,
	currency,
	onReset,
}: TransferResultProps) => {
	const router = useRouter();

	const goToStatement = () => {
		router.push(ROUTES.STATEMENT);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-2 py-4">
				<CheckCircle2 className="h-12 w-12 text-green-500" />
				<h2 className="text-xl font-semibold">Transfer Submitted</h2>
				<p className="text-sm text-muted-foreground">
					Your transfer is processing
				</p>
			</div>

			<div className="rounded-lg border border-accent p-4 flex flex-col gap-3">
				<div className="flex justify-between items-center">
					<span className="text-sm text-muted-foreground">Amount</span>
					<span className="text-base font-semibold">
						{formatUSD(transferData.amount)} <span>{currency}</span>
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

			<div className="flex flex-col gap-1">
				<Button size="lg" onClick={onReset}>
					New Transfer
				</Button>

				<Button variant="outline" size="lg" onClick={goToStatement}>
					View Statement
				</Button>
			</div>
		</div>
	);
};

export default TransferResult;
