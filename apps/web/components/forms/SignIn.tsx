"use client";

import { GoogleSignInButton } from "@repo/ui";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ROUTES from "@/lib/constants/routes";
import BrandingPanel from "./BrandingPanel";

const SignIn = () => {
	const [isPending, setIsPending] = useState(false);

	const handleGoogleSignIn = async () => {
		setIsPending(true);
		await authClient.signIn.social({
			provider: "google",
			callbackURL: ROUTES.DASHBOARD,
			fetchOptions: {
				onError: (ctx) => {
					toast.error(ctx.error.message);
					setIsPending(false);
				},
			},
		});
	};

	return (
		<div className="min-h-screen flex">
			<BrandingPanel />

			<div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
				<div className="w-full max-w-sm">
					<div className="lg:hidden flex flex-col items-center mb-10">
						<Image
							src="/asset/logo.svg"
							alt="DerivPA"
							width={52}
							height={52}
							priority
						/>
						<h2 className="mt-3 text-xl font-bold tracking-tight">DerivPA</h2>
					</div>

					<div className="space-y-1.5">
						<h2 className="text-2xl font-semibold tracking-tight">
							Welcome back
						</h2>
						<p className="text-sm text-muted-foreground">
							Sign in to your DerivPA account to continue
						</p>
					</div>

					<div className="mt-8">
						<GoogleSignInButton
							onClick={handleGoogleSignIn}
							isPending={isPending}
						/>
					</div>

					<p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
						By signing in you agree to our{" "}
						<span className="underline underline-offset-2 hover:text-foreground transition-colors cursor-default">
							Terms of Service
						</span>{" "}
						and{" "}
						<span className="underline underline-offset-2 hover:text-foreground transition-colors cursor-default">
							Privacy Policy
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
