"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Badge,
	Banner,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Copy,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
	Paste,
	Spinner,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { TransferStatusCheckResponse } from "@/lib/api/server-api";
import { transactionService } from "@/lib/api/transaction-service";
import { getTZDate } from "@/lib/utils/date";
import { formatAmount } from "@/lib/utils/statement";
import { TransferStatusLookupSchema } from "@/lib/validations/deriv/transfer-status";

type TransferStatusCheckerProps = {
	initialTransactionId?: string;
};

const DERIV_STATUS_VARIANT: Record<
	string,
	"outline" | "default" | "matched" | "destructive"
> = {
	complete: "matched",
	pending: "default",
	requested: "default",
	rejected: "destructive",
	failed: "destructive",
};

const TransferStatusChecker = ({
	initialTransactionId,
}: TransferStatusCheckerProps) => {
	const form = useForm<z.infer<typeof TransferStatusLookupSchema>>({
		resolver: zodResolver(TransferStatusLookupSchema),
		defaultValues: { id: initialTransactionId ?? "" },
	});

	const [result, setResult] = useState<TransferStatusCheckResponse | null>(
		null,
	);
	const [lookupError, setLookupError] = useState<string | null>(null);

	const handleSubmit = async (
		data: z.infer<typeof TransferStatusLookupSchema>,
	) => {
		setLookupError(null);
		setResult(null);

		const [response, error] = await tryCatch(() =>
			transactionService.checkTransferStatus(data.id),
		);

		if (error) return setLookupError(error.message);
		if (!response.success) {
			return setLookupError(response.error?.message ?? "Something went wrong");
		}

		setResult(response.data ?? null);
	};

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Look up a transfer</CardTitle>
					<CardDescription>
						Enter a transaction id to check its live status with Deriv.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						id="transfer-status-form"
						onSubmit={form.handleSubmit(handleSubmit)}
						autoComplete="off"
					>
						<FieldGroup>
							<Controller
								name="id"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="id">Transaction ID</FieldLabel>
										<div className="relative">
											<Input
												{...field}
												id="id"
												placeholder="Paste the transaction id"
												aria-invalid={fieldState.invalid}
												className="no-ring pr-9"
											/>
											<Paste
												className="absolute top-1/2 right-12 -translate-y-1/2"
												onPaste={(value) => field.onChange(value)}
											/>
										</div>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>

				<CardFooter>
					<Field orientation="responsive">
						<Button
							disabled={form.formState.isSubmitting}
							form="transfer-status-form"
							type="submit"
							className="gap-2"
						>
							{form.formState.isSubmitting ? (
								<Spinner className="size-4" />
							) : (
								<>
									<Search className="size-4" />
									Check Status
								</>
							)}
						</Button>
					</Field>
				</CardFooter>
			</Card>

			{lookupError && (
				<Banner
					variant="destructive"
					title="Lookup failed"
					message={lookupError}
				/>
			)}

			{result && <TransferStatusResult result={result} />}
		</div>
	);
};

const TransferStatusResult = ({
	result,
}: {
	result: TransferStatusCheckResponse;
}) => {
	const { transaction, status } = result;

	return (
		<div className="space-y-10">
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between">
						<div>
							{transaction.clientName ? (
								<p className="font-medium">{transaction.clientName}</p>
							) : (
								<Copy value={transaction.clientId}>
									<span className="font-medium">{transaction.clientId}</span>
								</Copy>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Amount</span>
						<span className="font-semibold">
							{formatAmount(Number(transaction.amount), transaction.currency)}
						</span>
					</div>

					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Date</span>
						<span>{getTZDate(transaction.createdAt)}</span>
					</div>

					<StatusOutcome status={status} />
				</CardContent>
			</Card>
		</div>
	);
};

const StatusOutcome = ({
	status,
}: {
	status: TransferStatusCheckResponse["status"];
}) => {
	if (status.outcome === "resolved") {
		return (
			<div className="flex items-center justify-between border-t pt-3 text-sm">
				<span className="text-muted-foreground">Deriv Status</span>
				<div className="flex items-center gap-2">
					<Badge
						variant={DERIV_STATUS_VARIANT[status.derivStatus] ?? "outline"}
					>
						{status.derivStatus}
					</Badge>
					{status.derivTransactionId !== null && (
						<span className="text-xs text-muted-foreground">
							ref: {status.derivTransactionId}
						</span>
					)}
				</div>
			</div>
		);
	}

	if (status.outcome === "not_found") {
		return (
			<Banner
				variant="destructive"
				title="Not found on Deriv"
				message="Deriv has no record of this transfer's request id."
			/>
		);
	}

	if (status.outcome === "deriv_unavailable") {
		return (
			<Banner
				variant="warning"
				title="Deriv unavailable"
				message="Deriv could not be reached to confirm this transfer. Try again shortly."
			/>
		);
	}

	return (
		<Banner
			variant="info"
			title="No Deriv transfer"
			message="This transaction has no linked Deriv payment-agent transfer to check."
		/>
	);
};

export default TransferStatusChecker;
