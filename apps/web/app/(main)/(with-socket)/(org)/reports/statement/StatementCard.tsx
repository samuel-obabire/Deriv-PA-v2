/* eslint-disable camelcase */
"use client";

import { type Rate } from "@repo/db";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Copy from "@/components/ui/copy";
import useClientName from "@/hooks/useClientName";
import {
	adjustUKDateInText,
	calculateNairaEquivalent,
	extractCounterpartyCR,
	extractRateFromAgentNote,
	formatAmount,
	formatNairaValue,
	type StatementTransaction,
} from "@/lib/utils/statement";

// ─── Front face ────────────────────────────────────────────────────────────────

type FrontProps = {
	transaction: StatementTransaction;
	currency: string;
	onFlip: () => void;
};

const StatementCardFront = ({ transaction, currency, onFlip }: FrontProps) => {
	const {
		action_type,
		amount,
		balance_after,
		transaction_time,
		transaction_id,
	} = transaction;

	const formattedAmount = formatAmount(amount as number, currency);
	const actionLabel = action_type
		? action_type.charAt(0).toUpperCase() + action_type.slice(1)
		: "—";

	return (
		<button type="button" className="w-full text-left" onClick={onFlip}>
			<Card className="mx-2 my-1 flex min-h-48 flex-col justify-between sm:mx-3 sm:my-2 sm:min-h-52">
				<CardHeader className="py-2 pt-5">
					<div className="flex items-center justify-between">
						{action_type === "deposit" ? (
							<ArrowDownLeft className="size-5 text-green-500 sm:size-6" />
						) : (
							<ArrowUpRight className="size-5 text-blue-500 sm:size-6" />
						)}
						<CardTitle
							className={`text-sm sm:text-base ${action_type === "deposit" ? "text-green-500" : "text-blue-600"}`}
						>
							{actionLabel}
						</CardTitle>
					</div>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between text-xs sm:text-sm">
							<span className="font-medium">Ref. ID</span>
							<span>Currency</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-xs underline sm:text-sm">
								{transaction_id}
							</span>
							<span className="rounded-sm bg-[#7da3a7] px-1.5 py-0.5 text-[9px] font-medium text-white">
								{currency}
							</span>
						</div>

						<div className="flex items-center justify-between text-xs sm:text-sm">
							<span className="font-medium">Transaction time</span>
							<span>Credit/Debit</span>
						</div>
						<div className="flex items-start justify-between gap-2">
							<span className="text-muted-foreground text-xs leading-snug sm:text-sm">
								{adjustUKDateInText(
									new Date((transaction_time as number) * 1000)
										.toUTCString()
										.replace(/^[A-Za-z]+,\s/, ""),
								)}
							</span>
							<span
								className={`shrink-0 text-xs font-bold sm:text-sm ${(amount as number) >= 0 ? "text-green-500" : "text-blue-600"}`}
							>
								{(amount as number) >= 0
									? `+${formattedAmount}`
									: formattedAmount}
							</span>
						</div>

						<div className="flex items-center justify-between text-xs sm:text-sm">
							<span className="font-medium">Balance</span>
							<span className="text-muted-foreground">
								{formatAmount(balance_after as number, currency)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</button>
	);
};

// ─── Back face ─────────────────────────────────────────────────────────────────

type BackProps = {
	transaction: StatementTransaction;
	rate: Rate;
	currency: string;
	onFlip: () => void;
};

const StatementCardBack = ({
	transaction,
	rate,
	currency,
	onFlip,
}: BackProps) => {
	const { action_type, longcode } = transaction;

	const counterpartyAccount = extractCounterpartyCR(longcode ?? "");
	const extractedRate =
		action_type === "withdrawal" ? extractRateFromAgentNote(longcode) : null;
	const nairaEquivalent = calculateNairaEquivalent(
		transaction,
		rate,
		extractedRate,
	);

	const {
		name: clientName,
		isLoading,
		error,
		fetchName,
	} = useClientName(counterpartyAccount, currency, rate.min);

	return (
		<Card
			className="mx-2 my-1 flex min-h-48 cursor-pointer items-center sm:mx-3 sm:my-2 sm:min-h-52"
			onClick={onFlip}
		>
			<CardContent className="w-full space-y-3 pt-4">
				<div className="text-muted-foreground wrap-break-word text-xs leading-relaxed sm:text-sm">
					{adjustUKDateInText(longcode ?? "")}
				</div>

				{nairaEquivalent !== null ? (
					<div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
						<span className="shrink-0">Naira Equivalent</span>
						<Copy
							value={Number(nairaEquivalent.toString().split(".")[0]).toFixed(
								2,
							)}
						>
							<span className="font-medium">
								{formatNairaValue(nairaEquivalent)}
							</span>
						</Copy>
					</div>
				) : null}

				{action_type === "deposit" ? (
					<div className="flex flex-wrap items-center gap-2">
						<Button
							size="xs"
							variant="outline"
							onClick={fetchName}
							disabled={isLoading}
						>
							{isLoading ? "..." : "Get Name"}
						</Button>

						{clientName || error ? (
							<Copy value={clientName ?? ""}>
								<span className="text-muted-foreground text-xs">
									{error ? "Something went wrong" : clientName}
								</span>
							</Copy>
						) : null}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
};

// ─── Shell (flip controller) ───────────────────────────────────────────────────

type Props = {
	transaction: StatementTransaction;
	currency: string;
	rate: Rate;
};

const StatementCard = ({ transaction, currency, rate }: Props) => {
	const [flipped, setFlipped] = useState(false);

	return (
		<div className="mx-auto w-full max-w-md sm:max-w-xl lg:max-w-2xl">
			{!flipped ? (
				<StatementCardFront
					transaction={transaction}
					currency={currency}
					onFlip={() => setFlipped(true)}
				/>
			) : (
				<StatementCardBack
					transaction={transaction}
					rate={rate}
					currency={currency}
					onFlip={() => setFlipped(false)}
				/>
			)}
		</div>
	);
};

export default StatementCard;
