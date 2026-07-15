"use client";

import { cn } from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { connectDerivRealNameAction } from "@/lib/actions/deriv/connectDerivRealName";
import {
	DERIV_OAUTH_STATE_STORAGE_KEY,
	DERIV_PKCE_VERIFIER_STORAGE_KEY,
} from "@/lib/constants/deriv";

type Status = "pending" | "success" | "error";

const DerivCallbackClient = () => {
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<Status>("pending");
	const [message, setMessage] = useState<string | null>(null);
	const hasRun = useRef(false);

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		const fail = (errorMessage: string) => {
			setStatus("error");
			setMessage(errorMessage);
			toast.error(errorMessage);
		};

		const run = async () => {
			const oauthError =
				searchParams.get("error_description") ?? searchParams.get("error");
			if (oauthError) return fail(oauthError);

			const code = searchParams.get("code");
			const state = searchParams.get("state");
			const storedState = sessionStorage.getItem(DERIV_OAUTH_STATE_STORAGE_KEY);
			const codeVerifier = sessionStorage.getItem(
				DERIV_PKCE_VERIFIER_STORAGE_KEY,
			);

			sessionStorage.removeItem(DERIV_OAUTH_STATE_STORAGE_KEY);
			sessionStorage.removeItem(DERIV_PKCE_VERIFIER_STORAGE_KEY);

			if (!code || !state || !codeVerifier) {
				return fail(
					"Missing information from Deriv. Please try connecting again.",
				);
			}

			if (state !== storedState) {
				return fail(
					"This request could not be verified. Please try connecting again.",
				);
			}

			const [result, error] = await tryCatch(() =>
				connectDerivRealNameAction(code, codeVerifier),
			);

			if (error) return fail(error.message);
			if (!result.success) {
				return fail(
					result.error?.message ??
						"Couldn't connect your Deriv account. Please try again.",
				);
			}

			setStatus("success");
			toast.success("Your real name is now visible to payment agents.");
		};

		run();
	}, [searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-sm text-center space-y-6">
				<div className="flex justify-center">
					<div
						className={cn(
							"flex size-16 items-center justify-center rounded-full ring-1",
							status === "error"
								? "bg-destructive/10 ring-destructive/20"
								: "bg-primary/10 ring-primary/20",
						)}
					>
						{status === "pending" && (
							<Loader2 className="size-8 text-primary animate-spin" />
						)}
						{status === "success" && (
							<CheckCircle2 className="size-8 text-primary" />
						)}
						{status === "error" && (
							<XCircle className="size-8 text-destructive" />
						)}
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight">
						{status === "pending" && "Connecting your Deriv account…"}
						{status === "success" && "You're all set."}
						{status === "error" && "Something went wrong."}
					</h1>
					<p className="text-sm text-muted-foreground">
						{status === "pending" &&
							"Please wait while we update your Deriv settings."}
						{status === "success" &&
							"Payment agents can now see your real name for deposits and withdrawals."}
						{status === "error" &&
							(message ?? "Please try connecting your Deriv account again.")}
					</p>
				</div>
			</div>
		</div>
	);
};

export default DerivCallbackClient;
