"use client";

import { Rate } from "@repo/db";
import useCurrency from "@/hooks/useCurrency";
import { NewTransferData } from "@/hooks/useRecentTransfers";
import useTransferFlow from "@/hooks/useTransferFlow";
import TransferDetails from "./TransferDetails";
import TransferError from "./TransferError";
import TransferResult from "./TransferResult";
import TransferToClientForm from "./TransferToClientForm";

type TransferToClientProps = {
	rate: Rate;
	onTransferSuccess: (data: NewTransferData) => void;
};

const TransferToClient = ({
	rate,
	onTransferSuccess,
}: TransferToClientProps) => {
	const {
		clearError,
		onReset,
		onTransferCancel,
		onTransferSubmit,
		onValidation,
		state,
		setIgnoreDuplicatePayment,
		canIgnoreDuplicatePayment,
	} = useTransferFlow();

	const { selectedCurrency } = useCurrency();

	const renderStep = () => {
		const { step, transferData, isPending } = state;

		switch (step) {
			case 1:
				return (
					<TransferToClientForm
						rate={rate}
						isPending={isPending}
						ignoreDuplicatePayment={state.options.ignoreDuplicatePayment}
						onIgnoreDuplicateChange={setIgnoreDuplicatePayment}
						initialData={transferData}
						activeCurrency={selectedCurrency as string}
						onSubmit={onValidation}
						canIgnoreDuplicatePayment={canIgnoreDuplicatePayment}
					/>
				);
			case 2:
				return (
					<TransferDetails
						isPending={isPending}
						data={transferData}
						onBack={onTransferCancel}
						onProceed={() =>
							onTransferSubmit(rate.deposit, (transactionId) => {
								onTransferSuccess({
									id: transactionId,
									clientAccount: transferData.clientAccount,
									clientName: transferData.clientName,
									amount: transferData.amount,
									currency: selectedCurrency ?? "",
								});
							})
						}
						currency={selectedCurrency as string}
					/>
				);
			case 3:
				return (
					<TransferResult
						currency={selectedCurrency as string}
						transferData={transferData}
						onReset={onReset}
					/>
				);
			default: {
				const exhaustiveStep: never = step;
				throw new Error(`Unhandled step: ${exhaustiveStep}`);
			}
		}
	};

	return (
		<div>
			{renderStep()}

			{state.errorMessage && (
				<TransferError
					message={state.errorMessage}
					open={!!state.errorMessage}
					title="Transfer Error"
					onOpenChange={clearError}
				/>
			)}
		</div>
	);
};

export default TransferToClient;
