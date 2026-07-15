"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Rate } from "@repo/db";
import {
	Button,
	Card,
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

const formInputClass =
	"h-11! rounded-xl! border! border-border/70! bg-background/40! px-3.5! text-base md:text-sm! font-medium shadow-xs transition-colors duration-200 hover:border-border! focus-visible:border-primary/50! aria-invalid:border-destructive! dark:border-border/60! dark:bg-white/3! dark:hover:border-border/80!";

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
				autoComplete="off"
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
									className={formInputClass}
									id="clientAccount"
									aria-invalid={fieldState.invalid}
									placeholder="Enter client account"
									autoComplete="off"
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
								<Card className="gap-3 rounded-2xl border border-border/70 bg-linear-to-br from-muted/40 via-card to-card px-4 py-4 shadow-xs ring-1 ring-foreground/5 dark:border-border/50 dark:from-white/3 dark:via-card dark:to-card dark:ring-white/5">
									<Field data-invalid={fieldState.invalid}>
										<div className="flex items-center justify-between">
											<FieldLabel
												htmlFor="ngnAmount"
												className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
											>
												NGN Amount
											</FieldLabel>
											<span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-xs dark:border-border/40 dark:bg-white/3">
												1 {activeCurrency} = {rate.deposit} NGN
											</span>
										</div>
										<Input
											className="h-auto! border-0! bg-transparent! p-0! text-3xl! font-semibold! tracking-tight! text-foreground shadow-none! focus-visible:ring-0! placeholder:text-muted-foreground/40"
											id="ngnAmount"
											placeholder="0.00"
											value={ngnAmount}
											onChange={handleNgnAmountChange}
											autoComplete="off"
										/>
									</Field>

									<div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3 dark:border-border/30">
										<span className="text-sm text-muted-foreground">
											≈ {field.value || "0.00"} {activeCurrency}
										</span>
										<div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-background/50 py-1 pr-2.5 pl-1 shadow-xs dark:border-border/30 dark:bg-white/3">
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
												className={formInputClass}
												id="amount"
												aria-invalid={fieldState.invalid}
												placeholder="0.00"
												onChange={handleAmountChange}
												autoComplete="off"
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
								</Card>
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
									autoComplete="off"
									className="w-full min-w-0 resize-none rounded-xl border border-border/70 bg-background/40 px-3.5 py-2.5 text-base font-medium shadow-xs transition-colors duration-200 outline-none placeholder:text-muted-foreground/60 hover:border-border focus-visible:border-primary/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:border-border/60 dark:bg-white/3 dark:hover:border-border/80"
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
				<Collapsible className="overflow-hidden rounded-xl border border-border/70 bg-card/40 shadow-xs dark:border-border/50 dark:bg-white/2">
					<CollapsibleTrigger className="group flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
						Advanced Options
						<ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
					</CollapsibleTrigger>
					<CollapsibleContent className="border-t border-border/60 px-3.5 py-3.5 dark:border-border/40">
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
				className="w-full rounded-xl shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/25"
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
