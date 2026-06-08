"use client";

import { Rate } from "@repo/db";
import useCurrency from "@/hooks/useCurrency";
import useTransferFlow from "@/hooks/useTransferFlow";
import TransferDetails from "./TransferDetails";
import TransferError from "./TransferError";
import TransferResult from "./TransferResult";
import TransferToClientForm from "./TransferToClientForm";

type TransferToClientProps = {
	rate: Rate;
};

const TransferToClient = ({ rate }: TransferToClientProps) => {
	const {
		clearError,
		onReset,
		onTransferCancel,
		onTransferSubmit,
		onValidation,
		state,
		setIgnoreDuplicatePayment,
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
					/>
				);
			case 2:
				return (
					<TransferDetails
						isPending={isPending}
						data={transferData}
						onBack={onTransferCancel}
						onProceed={onTransferSubmit}
						currency={selectedCurrency as string}
					/>
				);
			case 3:
				return <TransferResult transferData={transferData} onReset={onReset} />;
			default: {
				const exhaustiveStep: never = step;
				throw new Error(`Unhandled step: ${exhaustiveStep}`);
			}
		}
	};

	return (
		<div className="w-full max-w-112.5 mx-auto">
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
