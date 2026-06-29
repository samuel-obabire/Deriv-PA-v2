"use client";

import { GoogleSignInButton } from "@repo/ui";
import { Lock, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import ROUTES from "@/lib/constants/routes";

const trustPoints = [
	{
		icon: ShieldCheck,
		label: "Your data is safe",
		desc: "Everything you submit is encrypted end-to-end",
	},
	{
		icon: Zap,
		label: "Quick and simple",
		desc: "The process is straightforward and only takes a few minutes",
	},
	{
		icon: Lock,
		label: "Privacy first",
		desc: "Your information is privately stored",
	},
];

type KycSignInProps = {
	callbackUrl?: string;
};

const KycSignIn = ({ callbackUrl }: KycSignInProps) => {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGoogleSignIn = async () => {
		setIsPending(true);
		setError(null);
		await authClient.signIn.social({
			provider: "google",
			callbackURL: callbackUrl ?? ROUTES.HOME,
			fetchOptions: {
				onError: (ctx) => {
					setError(ctx.error.message);
					setIsPending(false);
				},
			},
		});
	};

	return (
		<div className="min-h-screen flex">
			<div className="dark hidden lg:flex lg:w-[46%] xl:w-1/2 relative flex-col items-center justify-center p-14 bg-background overflow-hidden">
				<div className="absolute top-1/3 -left-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 flex flex-col items-start max-w-xs w-full">
					<div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-8">
						<ShieldCheck className="size-6 text-primary" />
					</div>

					<h1 className="text-[2rem] font-bold text-foreground tracking-tight leading-tight">
						Identity
						<br />
						Verification
					</h1>

					<p className="mt-3 text-14-regular text-muted-foreground leading-relaxed">
						Complete or update your identity verification. Sign in to continue —
						it's secure and only takes a few minutes.
					</p>

					<div className="mt-10 w-full space-y-5">
						{trustPoints.map(({ icon: Icon, label, desc }) => (
							<div key={label} className="flex items-start gap-3">
								<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
									<Icon className="size-4 text-primary" />
								</div>
								<div>
									<p className="text-14-medium text-foreground">{label}</p>
									<p className="text-12-regular text-muted-foreground mt-0.5">
										{desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<p className="absolute bottom-8 text-12-regular text-muted-foreground tracking-widest uppercase">
					256-bit encrypted · Secure process
				</p>
			</div>

			<div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
				<div className="w-full max-w-sm">
					<div className="lg:hidden flex flex-col items-center mb-10">
						<div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
							<ShieldCheck className="size-6 text-primary" />
						</div>
					</div>

					<div className="space-y-1.5">
						<h2 className="text-2xl font-semibold tracking-tight">
							Identity verification
						</h2>
						<p className="text-sm text-muted-foreground">
							Sign in with Google to complete or update your KYC verification.
						</p>
					</div>

					<div className="mt-8 space-y-3">
						<GoogleSignInButton
							onClick={handleGoogleSignIn}
							isPending={isPending}
						/>

						{error && (
							<p className="text-sm text-destructive text-center">{error}</p>
						)}
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

export default KycSignIn;
