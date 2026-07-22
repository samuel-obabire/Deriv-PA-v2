import type { DuplicateTransferDetails } from "@repo/deriv";

export type Step = 1 | 2 | 3;

export type TransferErrorState = {
	message: string;
	details?: DuplicateTransferDetails;
};

export type Action =
	| { type: "setStep"; payload: Step }
	| { type: "setData"; payload: State["transferData"] }
	| { type: "setError"; payload: TransferErrorState }
	| { type: "setPending"; payload: boolean }
	| { type: "setIdempotencyKey"; payload: string }
	| { type: "setIgnoreDuplicatePayment"; payload: boolean }
	| { type: "clearError" }
	| { type: "reset" };

export type TransferData = {
	clientAccount: string;
	clientName?: string;
	amount: string;
	ngnAmount: string;
	description?: string;
};

export type State = {
	step: Step;
	transferData: TransferData;
	error?: TransferErrorState;
	isPending: boolean;
	options: {
		idempotencyKey?: string;
		ignoreDuplicatePayment: boolean;
	};
};
