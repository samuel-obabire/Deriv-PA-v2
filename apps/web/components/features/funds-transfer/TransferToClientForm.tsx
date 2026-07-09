"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Rate } from "@repo/db";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
	Switch,
} from "@repo/ui";
import { div, mul, sub } from "@repo/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { createTransferToClientSchema } from "@/lib/validations/deriv/transfer-to-client";
import { TransferData } from "./types";

type TransferToClientFormProps = {
	rate: Rate;
	isPending: boolean;
	ignoreDuplicatePayment: boolean;
	onIgnoreDuplicateChange: (value: boolean) => void;
	initialData: {
		clientAccount: string;
		amount: string;
		ngnAmount?: string;
		description?: string;
	};
	onSubmit: (data: TransferData) => Promise<void>;
	activeCurrency: string;
	canIgnoreDuplicatePayment: boolean;
};

const computeNgn = (usdValue: string, depositRate: number): string => {
	if (!usdValue) return "";
	return mul(usdValue, depositRate).toDecimalPlaces(2).toString();
};

const computeUsdAmount = (
	ngnValue: Parameters<typeof div>[0],
	deposit: number,
): string => {
	const usd = div(ngnValue, deposit).toDecimalPlaces(2);
	return usd.lt(0) ? "0" : usd.toString();
};

const TransferToClientForm = ({
	ignoreDuplicatePayment,
	initialData,
	isPending,
	onIgnoreDuplicateChange,
	onSubmit,
	rate,
	activeCurrency,
	canIgnoreDuplicatePayment,
}: TransferToClientFormProps) => {
	const schema = createTransferToClientSchema({
		min: rate.min,
		max: rate.max,
		currency: activeCurrency,
	});

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			clientAccount: initialData.clientAccount,
			amount: initialData.amount,
			description: initialData.description,
		},
	});

	const [amountEnabled, setAmountEnabled] = useState(false);
	const [waiveCharge, setWaiveCharge] = useState(false);

	const [ngnAmount, setNgnAmount] = useState(() => {
		if (initialData.ngnAmount) return initialData.ngnAmount;
		return initialData.amount
			? computeNgn(initialData.amount, rate.deposit)
			: "";
	});

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		await onSubmit({ ...data, ngnAmount });
	};

	const handleNgnAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setNgnAmount(val);
		if (!val) {
			form.setValue("amount", "", { shouldValidate: true });
			return;
		}
		const rawUsd = div(val, rate.deposit);
		const ngnForCalc =
			!waiveCharge && rawUsd.lt(rate.smallAmount)
				? sub(val, rate.charge)
				: rawUsd.times(rate.deposit);
		form.setValue("amount", computeUsdAmount(ngnForCalc, rate.deposit), {
			shouldValidate: true,
		});
	};

	const handleChargeWaive = (chargedWaived: boolean) => {
		const ngnForCalc = chargedWaived ? ngnAmount : sub(ngnAmount, rate.charge);
		form.setValue("amount", computeUsdAmount(ngnForCalc, rate.deposit), {
			shouldValidate: true,
		});
	};

	const handleWaiveChargeChange = (checked: boolean) => {
		setWaiveCharge(checked);

		handleChargeWaive(checked);
	};

	return (
		<div className="space-y-6">
			<form
				id="transfer-to-client-form"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FieldGroup>
					<Controller
						name="clientAccount"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="clientAccount">Client Account</FieldLabel>
								<Input
									{...field}
									className="input-class"
									id="clientAccount"
									aria-invalid={fieldState.invalid}
									placeholder="Enter client account"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="amount"
						control={form.control}
						render={({ field, fieldState }) => {
							const handleAmountChange = (
								e: React.ChangeEvent<HTMLInputElement>,
							) => {
								field.onChange(e);
								setNgnAmount(computeNgn(e.target.value, rate.deposit));
							};

							return (
								<div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
									<Field data-invalid={fieldState.invalid}>
										<div className="flex items-center justify-between">
											<FieldLabel htmlFor="ngnAmount">NGN Amount</FieldLabel>
											<span className="text-xs font-medium text-muted-foreground">
												1 {activeCurrency} = {rate.deposit} NGN
											</span>
										</div>
										<Input
											className="input-class"
											id="ngnAmount"
											placeholder="0.00"
											value={ngnAmount}
											onChange={handleNgnAmountChange}
										/>
									</Field>

									<div className="flex items-center justify-between gap-2">
										<span className="text-sm text-muted-foreground">
											≈ {field.value || "0.00"} {activeCurrency}
										</span>
										<div className="flex items-center gap-1.5 shrink-0">
											<Switch
												size="sm"
												id="waive-charge"
												checked={waiveCharge}
												onCheckedChange={handleWaiveChargeChange}
											/>
											<label
												htmlFor="waive-charge"
												className="text-xs text-muted-foreground cursor-pointer select-none"
											>
												Waive charge
											</label>
										</div>
									</div>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}

									{amountEnabled ? (
										<Field data-invalid={fieldState.invalid}>
											<div className="flex items-center justify-between">
												<FieldLabel htmlFor="amount">
													Amount ({activeCurrency})
												</FieldLabel>
												<button
													type="button"
													onClick={() => setAmountEnabled(false)}
													className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
												>
													Hide
												</button>
											</div>
											<Input
												{...field}
												className="input-class"
												id="amount"
												aria-invalid={fieldState.invalid}
												placeholder="0.00"
												onChange={handleAmountChange}
											/>
										</Field>
									) : (
										<button
											type="button"
											onClick={() => setAmountEnabled(true)}
											className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
										>
											Edit USD manually
										</button>
									)}
								</div>
							);
						}}
					/>

					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="description">Description</FieldLabel>
								<textarea
									{...field}
									id="description"
									aria-invalid={fieldState.invalid}
									placeholder="Enter description"
									rows={4}
									className="text-area w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
			</form>

			{canIgnoreDuplicatePayment && (
				<Collapsible className="rounded-lg border border-border">
					<CollapsibleTrigger className="group flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
						Advanced Options
						<ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
					</CollapsibleTrigger>
					<CollapsibleContent className="px-3 py-3">
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="ignore-duplicate-payment">
									Ignore duplicate payment
								</FieldLabel>
								<Switch
									size="sm"
									id="ignore-duplicate-payment"
									checked={ignoreDuplicatePayment}
									onCheckedChange={onIgnoreDuplicateChange}
								/>
							</div>
						</Field>
					</CollapsibleContent>
				</Collapsible>
			)}

			<Button
				className="w-full"
				size="lg"
				form="transfer-to-client-form"
				type="submit"
				disabled={isPending}
			>
				Transfer
			</Button>
		</div>
	);
};

export default TransferToClientForm;
