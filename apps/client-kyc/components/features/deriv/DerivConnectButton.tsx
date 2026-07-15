"use client";

import { Button } from "@repo/ui";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	DERIV_OAUTH_STATE_STORAGE_KEY,
	DERIV_PKCE_VERIFIER_STORAGE_KEY,
} from "@/lib/constants/deriv";
import ROUTES from "@/lib/constants/routes";
import {
	buildDerivAuthorizeUrl,
	generateDerivOAuthState,
	generateDerivPkcePair,
} from "@/lib/utils/deriv";
import { clientEnv } from "@/lib/validations/env/client";

const DerivConnectButton = () => {
	const [isPending, setIsPending] = useState(false);

	const handleConnect = async () => {
		setIsPending(true);

		try {
			const { codeVerifier, codeChallenge } = await generateDerivPkcePair();
			const state = generateDerivOAuthState();

			sessionStorage.setItem(DERIV_PKCE_VERIFIER_STORAGE_KEY, codeVerifier);
			sessionStorage.setItem(DERIV_OAUTH_STATE_STORAGE_KEY, state);

			window.location.href = buildDerivAuthorizeUrl({
				appId: clientEnv.NEXT_PUBLIC_DERIV_APP_ID,
				redirectUri: `${clientEnv.NEXT_PUBLIC_URL}${ROUTES.DERIV_CALLBACK}`,
				state,
				codeChallenge,
			});
		} catch {
			setIsPending(false);
			toast.error("Couldn't start the Deriv connection. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-sm text-center space-y-6">
				<div className="flex justify-center">
					<div className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
						<ShieldCheck className="size-8 text-primary" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight">
						Show your real name to payment agents
					</h1>
					<p className="text-sm text-muted-foreground">
						To process your deposits and withdrawals, payment agents need to see
						your real name on your Deriv account. Connect your Deriv account to
						turn this on.
					</p>
				</div>

				<Button
					className="w-full h-11 gap-2"
					onClick={handleConnect}
					disabled={isPending}
				>
					{isPending && <Loader2 className="size-4 animate-spin" />}
					{isPending ? "Redirecting to Deriv…" : "Connect Deriv account"}
				</Button>
			</div>
		</div>
	);
};

export default DerivConnectButton;
