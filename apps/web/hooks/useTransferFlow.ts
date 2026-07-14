import { CURRENCY } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useReducer } from "react";
import {
	Action,
	State,
	TransferData,
} from "@/components/features/funds-transfer/types";
import { hasRoleStatement } from "@/components/features/nav/sidebar/utils";
import { useSession } from "@/lib/auth-client";
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
	const { data: session } = useSession();

	const canIgnoreDuplicatePayment = hasRoleStatement(
		session?.user.role ?? "member",
		{ resource: "payment", action: "configure" },
	);

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

		// Reused as Deriv's request_id when the real transfer submits later —
		// one unique value per transfer attempt for both our own idempotency
		// check and Deriv's anti-replay check.
		const idempotencyKey = crypto.randomUUID();

		const [validationResult, error] = await tryCatch(() =>
			socketClient.validatePaymentAgentTransfer(
				{
					to_nickname: transferData.clientAccount,
					amount: transferData.amount,
					currency: selectedCurrency as CURRENCY,
					notes: transferData.description ?? "",
					request_id: idempotencyKey,
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

		// if (validationResult.client_real_name === null) {
		// 	dispatch({
		// 		type: "setError",
		// 		payload: "Client name could not be validated",
		// 	});

		// 	return;
		// }

		dispatch({ type: "setIdempotencyKey", payload: idempotencyKey });
		dispatch({ type: "setStep", payload: 2 });
		dispatch({
			type: "setData",
			payload: {
				...transferData,
				clientName: validationResult.client_real_name || "",
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

		// Sent to Deriv as the payment-agent remark — client name + rate only.
		// The staff-typed free text is sent separately below as `notes`, for
		// our own transaction record, and never reaches Deriv.
		const derivNote = buildTransferDescription(
			state.transferData.clientName ?? "",
			depositRate,
		);

		const [result, error] = await tryCatch(() =>
			socketClient.transferFunds(
				{
					to_nickname: state.transferData.clientAccount,
					amount: state.transferData.amount,
					currency: selectedCurrency as CURRENCY,
					notes: derivNote,
					request_id: idempotencyKey,
				},
				{
					idempotencyKey,
					ignoreDuplicatePayment: state.options.ignoreDuplicatePayment,
					notes: state.transferData.description,
					depositRate,
				},
			),
		);

		setPending(false);

		if (error) {
			dispatch({
				type: "setError",
				payload:
					error.message ||
					"Something went wrong. Please review statement before retrying",
			});

			return;
		}

		dispatch({ type: "setStep", payload: 3 });

		if (result.id) onSuccess?.(result.id);
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
		canIgnoreDuplicatePayment,
	};
};

export default useTransferFlow;
