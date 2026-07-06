"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Rate } from "@repo/db";
import {
	Button,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input,
	Switch,
} from "@repo/ui";
import { div, mul, sub } from "@repo/utils";
import { ArrowUpDown } from "lucide-react";
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

					<div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
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
									<Field data-invalid={fieldState.invalid}>
										<div className="flex items-center justify-between">
											<FieldLabel htmlFor="amount">
												Amount ({activeCurrency})
											</FieldLabel>
											<div className="flex items-center gap-1.5">
												<Switch
													size="sm"
													id="amount-override"
													checked={amountEnabled}
													onCheckedChange={setAmountEnabled}
												/>
												<label
													htmlFor="amount-override"
													className="text-xs text-muted-foreground cursor-pointer select-none"
												>
													Edit manually
												</label>
											</div>
										</div>
										<Input
											{...field}
											className="input-class"
											id="amount"
											aria-invalid={fieldState.invalid}
											placeholder="0.00"
											onChange={handleAmountChange}
											disabled={!amountEnabled}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								);
							}}
						/>

						<div className="flex items-center gap-2.5">
							<div className="h-px flex-1 bg-border" />
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<ArrowUpDown className="size-3" />1 {activeCurrency}={" "}
								{rate.deposit} NGN
							</span>
							<div className="h-px flex-1 bg-border" />
						</div>

						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="ngnAmount">NGN Amount</FieldLabel>
								<div className="flex items-center gap-1.5">
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
										Waive small charge
									</label>
								</div>
							</div>
							<Input
								className="input-class"
								id="ngnAmount"
								placeholder="0.00"
								value={ngnAmount}
								onChange={handleNgnAmountChange}
							/>
						</Field>
					</div>

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
									className="input-class w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

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
				</FieldGroup>
			</form>

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
