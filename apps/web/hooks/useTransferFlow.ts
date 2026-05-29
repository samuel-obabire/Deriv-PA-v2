import { CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useReducer } from "react";
import { Action, State, TransferData } from "@/components/funds-transfer/types";
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
			return { ...state, idempotencyKey: action.payload };
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

	const transfer = (
		data: TransferData,
		dryRun: boolean,
		idempotencyKey: string,
	) => {
		if (!socketClient) throw new Error("Socket disconnected");

		return socketClient.transferFunds(
			{
				paymentagent_transfer: 1,
				amount: Number(data.amount),
				currency: selectedCurrency as CURRENCY,
				dry_run: dryRun ? 1 : 0,
				transfer_to: data.clientAccount,
				description: data.description,
			},
			{ idempotencyKey },
		);
	};

	const setPending = (pending: boolean) => {
		dispatch({ type: "setPending", payload: pending });
	};

	const onValidation = async (transferData: TransferData) => {
		setPending(true);

		const idempotencyKey = crypto.randomUUID();

		const [validationResult, error] = await tryCatch(() =>
			transfer(transferData, true, idempotencyKey),
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

	const onTransferSubmit = async () => {
		const { idempotencyKey } = state;
		if (!idempotencyKey) return;

		setPending(true);

		const [, error] = await tryCatch(() =>
			transfer(state.transferData, false, idempotencyKey),
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
	};

	const onReset = () => {
		dispatch({ type: "reset" });
	};

	const onTransferCancel = () => {
		dispatch({ type: "setStep", payload: 1 });
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
	};
};

export default useTransferFlow;
