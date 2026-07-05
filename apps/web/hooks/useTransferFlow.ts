import { CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useReducer } from "react";
import {
	Action,
	State,
	TransferData,
} from "@/components/features/funds-transfer/types";
import { buildTransferDescription } from "@/lib/utils/transfer";
import useCurrency from "./useCurrency";
import useSocket from "./useSocket";

const initialState: State = {
	step: 1,
	transferData: {
		clientAccount: "",
		clientName: "",
		amount: "",
		ngnAmount: "",
		description: "",
	},
	errorMessage: "",
	isPending: false,
	options: {
		ignoreDuplicatePayment: false,
	},
};

const transferReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "setStep":
			return { ...state, step: action.payload };
		case "setData":
			return {
				...state,
				transferData: { ...state.transferData, ...action.payload },
			};
		case "setError":
			return { ...state, errorMessage: action.payload };
		case "setPending":
			return { ...state, isPending: action.payload };
		case "setIdempotencyKey":
			return {
				...state,
				options: { ...state.options, idempotencyKey: action.payload },
			};
		case "setIgnoreDuplicatePayment":
			return {
				...state,
				options: { ...state.options, ignoreDuplicatePayment: action.payload },
			};
		case "reset":
			return initialState;
		default:
			return state;
	}
};

const useTransferFlow = () => {
	const [state, dispatch] = useReducer(transferReducer, initialState);

	const { socketClient } = useSocket();
	const { selectedCurrency } = useCurrency();

	const setPending = (pending: boolean) => {
		dispatch({ type: "setPending", payload: pending });
	};

	const setIgnoreDuplicatePayment = (ignoreDuplicatePayment: boolean) => {
		dispatch({
			type: "setIgnoreDuplicatePayment",
			payload: ignoreDuplicatePayment,
		});
	};

	const onValidation = async (transferData: TransferData) => {
		if (!socketClient) throw new Error("Socket disconnected");

		setPending(true);

		const idempotencyKey = crypto.randomUUID();

		const [validationResult, error] = await tryCatch(() =>
			socketClient.validateTransfer(
				{
					paymentagent_transfer: 1,
					amount: Number(transferData.amount),
					currency: selectedCurrency as CURRENCY,
					dry_run: 1,
					transfer_to: transferData.clientAccount,
					description: transferData.description,
				},
				{ ignoreDuplicatePayment: state.options.ignoreDuplicatePayment },
			),
		);

		setPending(false);

		if (error) {
			dispatch({
				type: "setError",
				payload: error.message || "Unable to complete your request",
			});

			return;
		}

		dispatch({ type: "setIdempotencyKey", payload: idempotencyKey });
		dispatch({ type: "setStep", payload: 2 });
		dispatch({
			type: "setData",
			payload: {
				...transferData,
				clientName: validationResult.client_to_full_name,
			},
		});
	};

	const onTransferSubmit = async (
		depositRate: number,
		onSuccess?: (transactionId: string) => void,
	) => {
		if (!socketClient) throw new Error("Socket disconnected");

		const { idempotencyKey } = state.options;
		if (!idempotencyKey) return;

		setPending(true);

		const description = buildTransferDescription(
			state.transferData.clientName ?? "",
			depositRate,
			state.transferData.description,
		);

		const [result, error] = await tryCatch(() =>
			socketClient.transferFunds(
				{
					paymentagent_transfer: 1,
					amount: Number(state.transferData.amount),
					currency: selectedCurrency as CURRENCY,
					dry_run: 0,
					transfer_to: state.transferData.clientAccount,
					description,
				},
				{
					idempotencyKey,
					ignoreDuplicatePayment: state.options.ignoreDuplicatePayment,
				},
			),
		);

		setPending(false);

		if (error) {
			dispatch({
				type: "setError",
				payload:
					error.message ||
					"Something went wrong. Please  review statement before retrying",
			});

			return;
		}

		dispatch({ type: "setStep", payload: 3 });

		const transactionId = (result as unknown as { id: string }).id;
		if (transactionId) onSuccess?.(transactionId);
	};

	const onReset = () => {
		dispatch({ type: "reset" });
	};

	const onTransferCancel = () => {
		dispatch({ type: "setStep", payload: 1 });
		dispatch({ type: "setIgnoreDuplicatePayment", payload: false });
	};

	const clearError = () => {
		dispatch({ type: "setError", payload: "" });
	};

	return {
		state,
		onValidation,
		onReset,
		onTransferCancel,
		onTransferSubmit,
		clearError,
		setIgnoreDuplicatePayment,
	};
};

export default useTransferFlow;
