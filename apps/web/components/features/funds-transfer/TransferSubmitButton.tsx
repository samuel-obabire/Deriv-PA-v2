"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Field,
	FieldLabel,
	Input,
} from "@repo/ui";
import { useState } from "react";
import {
	formatAmountInput,
	sanitizeAmountInput,
} from "@/lib/utils/formatCurrency";

const CONFIRMATION_THRESHOLD_USD = 100;

type TransferSubmitButtonProps = {
	usdAmount: string;
	ngnAmount: string;
	formId: string;
	isPending: boolean;
	onConfirm: () => void;
};

const TransferSubmitButton = ({
	usdAmount,
	ngnAmount,
	formId,
	isPending,
	onConfirm,
}: TransferSubmitButtonProps) => {
	const [open, setOpen] = useState(false);
	const [confirmedNgnAmount, setConfirmedNgnAmount] = useState("");

	const buttonClassName =
		"w-full rounded-xl shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/25";

	const requiresConfirmation = Number(usdAmount) >= CONFIRMATION_THRESHOLD_USD;

	if (!requiresConfirmation) {
		return (
			<Button
				className={buttonClassName}
				size="lg"
				form={formId}
				type="submit"
				disabled={isPending}
			>
				Transfer
			</Button>
		);
	}

	const handleContinue = () => {
		setOpen(false);
		onConfirm();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) setConfirmedNgnAmount("");
			}}
		>
			<DialogTrigger asChild>
				<Button
					className={buttonClassName}
					size="lg"
					type="button"
					disabled={isPending}
				>
					Transfer
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm transfer amount</DialogTitle>
					<DialogDescription>
						Retype the NGN amount to confirm this transfer.
					</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor="confirmNgnAmount">NGN Amount</FieldLabel>
					<Input
						id="confirmNgnAmount"
						placeholder="0.00"
						value={formatAmountInput(confirmedNgnAmount)}
						onChange={(e) =>
							setConfirmedNgnAmount(sanitizeAmountInput(e.target.value))
						}
						autoComplete="off"
					/>
				</Field>

				<DialogFooter>
					<Button
						type="button"
						disabled={isPending || confirmedNgnAmount !== ngnAmount}
						onClick={handleContinue}
					>
						Continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TransferSubmitButton;
