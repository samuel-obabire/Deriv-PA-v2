export type Step = 1 | 2 | 3;

export type Action =
	| { type: "setStep"; payload: Step }
	| { type: "setData"; payload: State["transferData"] }
	| { type: "setError"; payload: string }
	| { type: "setPending"; payload: boolean }
	| { type: "setIdempotencyKey"; payload: string }
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
	errorMessage?: string;
	isPending: boolean;
	idempotencyKey?: string;
};
