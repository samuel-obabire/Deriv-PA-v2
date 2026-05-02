import { tryCatch } from "@repo/utils";
import { useReducer } from "react";
import { Action, State, TransferData } from "@/components/funds-transfer/types";

import useSocket from "./useSocket";

const initialState: State = {
	step: 1,
	transferData: {
		clientAccount: "",
		clientName: "",
		amount: "",
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
		case "reset":
			return initialState;
		default:
			return state;
	}
};

const useTransferFlow = () => {
	const [state, dispatch] = useReducer(transferReducer, initialState);

	const { socketClient } = useSocket();

	const transfer = (data: TransferData, dryRun: boolean) => {
		// return a rejected error promise  so that tryCatch catches it.
		// tryCatch will only catch errors thrown by a rejected promise
		if (!socketClient) return Promise.reject(new Error("Socket disconnected"));

		const transferResponse = socketClient.transferFunds({
			paymentagent_transfer: 1,
			amount: Number(data.amount),
			currency: "USD",
			dry_run: dryRun ? 1 : 0,
			transfer_to: data.clientAccount,
			description: data.description,
		});

		return transferResponse;
	};

	const setPending = (pending: boolean) => {
		dispatch({ type: "setPending", payload: pending });
	};

	const onValidation = async (transferData: TransferData) => {
		setPending(true);

		const [validationResult, error] = await tryCatch(
			transfer(transferData, true),
		);

		setPending(false);

		if (error) {
			dispatch({
				type: "setError",
				payload: error.message || "Unable to complete your request",
			});

			return;
		}

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
		setPending(true);

		const [, error] = await tryCatch(transfer(state.transferData, false));

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
