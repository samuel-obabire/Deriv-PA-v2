import type { KycFormData } from "@/lib/validations/kyc";

export type KycMethod = "select" | "manual";

export type State = {
	method: KycMethod;
	step: number;
	formData: KycFormData;
	isPending: boolean;
};

export type Action =
	| { type: "startManual" }
	| { type: "next"; payload: KycFormData }
	| { type: "back" }
	| { type: "setPending"; payload: boolean };
