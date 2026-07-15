import * as z from "zod";

export const DerivConnectCallbackSchema = z.object({
	code: z.string().min(1, "Authorization code is required"),
	codeVerifier: z.string().min(1, "Code verifier is required"),
});
