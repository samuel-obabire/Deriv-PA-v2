import { useReducer } from "react";
import { Action, State } from "@/components/features/kyc/types";
import type { KycFormData } from "@/lib/validations/kyc";

const kycFlowReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "startManual":
			return { ...state, method: "manual" };
		case "next":
			return {
				...state,
				formData: { ...state.formData, ...action.payload },
				step: state.step + 1,
			};
		case "back":
			return { ...state, step: state.step - 1 };
		case "setPending":
			return { ...state, isPending: action.payload };
		default:
			return state;
	}
};

const useKycFlow = (initialFormData: KycFormData) => {
	const [state, dispatch] = useReducer(kycFlowReducer, {
		method: "select",
		step: 1,
		formData: initialFormData,
		isPending: false,
	});

	const startManual = () => dispatch({ type: "startManual" });

	const next = (stepData: KycFormData) => {
		dispatch({ type: "next", payload: stepData });
	};

	const back = () => dispatch({ type: "back" });

	const setPending = (pending: boolean) => {
		dispatch({ type: "setPending", payload: pending });
	};

	return { state, startManual, next, back, setPending };
};

export default useKycFlow;
