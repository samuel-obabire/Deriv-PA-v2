/* eslint-disable camelcase */
"use client";

import { type Rate } from "@repo/db";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Copy,
} from "@repo/ui";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { StatementStatusBadge } from "@/components/ui/statement-status-badge";
import useClientName, { type ClientNameError } from "@/hooks/useClientName";
import {
	adjustUKDateInText,
	calculateNairaEquivalent,
	formatAmount,
	formatNairaValue,
	type StatementTransaction,
} from "@/lib/utils/statement";

// ─── Front face ────────────────────────────────────────────────────────────────

type FrontProps = {
	transaction: StatementTransaction;
	onFlip: () => void;
};

const StatementCardFront = ({ transaction, onFlip }: FrontProps) => {
	const { category, metadata, timestamp, transaction_id } = transaction;

	const amount = Number(metadata.transaction_net_amount);
	const formattedAmount = formatAmount(amount, metadata.transaction_currency);
	const actionLabel = category.charAt(0).toUpperCase() + category.slice(1);
	const counterpartyLabel =
		category === "deposit" ? "Source Client ID" : "Destination Client ID";
	const counterpartyClientId =
		category === "deposit"
			? metadata.source_client_id
			: metadata.destination_client_id;

	return (
		<button type="button" className="w-full text-left" onClick={onFlip}>
			<Card className="mx-2 my-1 flex min-h-48 flex-col justify-between sm:mx-3 sm:my-2 sm:min-h-52">
				<CardHeader className="py-2 pt-5">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{category === "deposit" ? (
								<ArrowDownLeft className="size-5 text-green-500 sm:size-6" />
							) : (
								<ArrowUpRight className="size-5 text-blue-500 sm:size-6" />
							)}
							<CardTitle
								className={`text-sm sm:text-base ${category === "deposit" ? "text-green-500" : "text-blue-600"}`}
							>
								{actionLabel}
							</CardTitle>
						</div>
						<StatementStatusBadge status={metadata.transaction_status} />
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
								{metadata.transaction_currency}
							</span>
						</div>

						<div className="flex items-center justify-between text-xs sm:text-sm">
							<span className="font-medium">Transaction time</span>
							<span>Credit/Debit</span>
						</div>
						<div className="flex items-start justify-between gap-2">
							<span className="text-muted-foreground text-xs leading-snug sm:text-sm">
								{adjustUKDateInText(
									new Date(timestamp)
										.toUTCString()
										.replace(/^[A-Za-z]+,\s/, ""),
								)}
							</span>
							<span
								className={`shrink-0 text-xs font-bold sm:text-sm ${category === "deposit" ? "text-green-500" : "text-blue-600"}`}
							>
								{category === "deposit"
									? `+${formattedAmount}`
									: `-${formattedAmount}`}
							</span>
						</div>

						<div className="flex min-w-0 items-center justify-between gap-2 text-xs sm:text-sm">
							<span className="shrink-0 font-medium">{counterpartyLabel}</span>
							<span className="truncate text-muted-foreground">
								{counterpartyClientId ?? "—"}
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
	onFlip: () => void;
	clientName: string | undefined;
	isLoading: boolean;
	error: ClientNameError;
	fetchName: () => Promise<void>;
};

const StatementCardBack = ({
	transaction,
	rate,
	onFlip,
	clientName,
	isLoading,
	error,
	fetchName,
}: BackProps) => {
	const { category, metadata, timestamp } = transaction;

	const amount = Number(metadata.transaction_net_amount);
	const formattedAmount = formatAmount(amount, metadata.transaction_currency);
	const nairaEquivalent = calculateNairaEquivalent(amount, category, rate);
	const counterpartyLabel =
		category === "deposit" ? "Source Client ID" : "Destination Client ID";
	const counterpartyClientId =
		category === "deposit"
			? metadata.source_client_id
			: metadata.destination_client_id;

	useEffect(() => {
		fetchName();
	}, [fetchName]);

	return (
		<Card
			className="mx-2 my-1 flex min-h-48 cursor-pointer items-center sm:mx-3 sm:my-2 sm:min-h-52"
			onClick={onFlip}
		>
			<CardContent className="w-full space-y-3 pt-4">
				<div className="flex items-start justify-between gap-2">
					<span className="text-muted-foreground text-xs leading-snug sm:text-sm">
						{adjustUKDateInText(
							new Date(timestamp).toUTCString().replace(/^[A-Za-z]+,\s/, ""),
						)}
					</span>
					<span
						className={`shrink-0 text-xs font-bold sm:text-sm ${category === "deposit" ? "text-green-500" : "text-blue-600"}`}
					>
						{category === "deposit"
							? `+${formattedAmount}`
							: `-${formattedAmount}`}
					</span>
				</div>

				{nairaEquivalent !== null &&
				transaction.metadata.transaction_status === "complete" ? (
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

				<div className="flex min-w-0 items-center justify-between gap-2 text-xs sm:text-sm">
					<span className="shrink-0 font-medium">{counterpartyLabel}</span>
					{counterpartyClientId ? (
						<Copy value={counterpartyClientId} className="min-w-0">
							<span className="truncate text-muted-foreground">
								{counterpartyClientId}
							</span>
						</Copy>
					) : (
						<span className="text-muted-foreground">—</span>
					)}
				</div>

				<div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
					<span className="shrink-0 font-medium">
						{category === "deposit" ? "Source Client" : "Destination Client"}
					</span>
					{isLoading ? (
						<span className="text-muted-foreground text-xs">Fetching...</span>
					) : clientName ? (
						<Copy value={clientName}>
							<span className="text-muted-foreground text-xs">
								{clientName}
							</span>
						</Copy>
					) : error === "not_connected" ? (
						<span className="text-muted-foreground text-xs">
							Client hasn't connected their Deriv account
						</span>
					) : error === "invalid" ? (
						<Button
							size="xs"
							variant="outline"
							disabled={isLoading}
							onClick={(e) => {
								e.stopPropagation();
								fetchName();
							}}
						>
							Retry
						</Button>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
};

// ─── Shell (flip controller) ───────────────────────────────────────────────────

type Props = {
	transaction: StatementTransaction;
	rate: Rate;
};

const StatementCard = ({ transaction, rate }: Props) => {
	const [flipped, setFlipped] = useState(false);

	const counterpartyClientId =
		transaction.category === "deposit"
			? transaction.metadata.source_client_id
			: transaction.metadata.destination_client_id;

	const {
		name: clientName,
		isPending,
		error,
		fetchName,
	} = useClientName(
		counterpartyClientId ?? null,
		transaction.metadata.transaction_currency,
		rate.min,
	);

	return (
		<div className="mx-auto w-full max-w-md sm:max-w-xl lg:max-w-2xl">
			{!flipped ? (
				<StatementCardFront
					transaction={transaction}
					onFlip={() => setFlipped(true)}
				/>
			) : (
				<StatementCardBack
					transaction={transaction}
					rate={rate}
					onFlip={() => setFlipped(false)}
					clientName={clientName}
					isLoading={isPending}
					error={error}
					fetchName={fetchName}
				/>
			)}
		</div>
	);
};

export default StatementCard;
