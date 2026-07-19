"use client";

import { Button, Separator } from "@repo/ui";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { persistKycInviteTokenAction } from "@/lib/actions/kyc/persistKycInviteToken";

type Props = {
	token: string;
	onStartManual: () => void;
};

const KycMethodSelect = ({ token, onStartManual }: Props) => {
	useEffect(() => {
		persistKycInviteTokenAction(token);
	}, [token]);

	return (
		<div className="space-y-6">
			<div className="space-y-1 text-center">
				<h2 className="text-xl font-semibold tracking-tight">
					Verify your identity
				</h2>
				<p className="text-sm text-muted-foreground">
					Choose how you'd like to complete your verification.
				</p>
			</div>

			<div className="space-y-4 rounded-xl border border-border p-5">
				<div className="flex items-start gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
						<ShieldCheck className="size-4 text-primary" />
					</div>
					<div>
						<p className="text-sm font-medium">Connect your Deriv account</p>
						<p className="mt-0.5 text-14-regular text-muted-foreground">
							We'll pull your verified name and nickname directly from Deriv.
						</p>
					</div>
				</div>

				<Button asChild className="w-full">
					{/** biome-ignore lint/a11y/useValidAnchor: placeholder until the Deriv OAuth authorize URL is wired up */}
					<a href="#">Connect with Deriv</a>
				</Button>

				<p className="text-xs leading-relaxed text-muted-foreground">
					We only request read-only profile access to confirm your identity. We
					cannot view your balance, place trades, or make withdrawals.
				</p>
			</div>

			<div className="flex items-center gap-3">
				<Separator className="flex-1" />
				<span className="text-xs text-muted-foreground uppercase">or</span>
				<Separator className="flex-1" />
			</div>

			<div className="space-y-3 rounded-xl border border-border p-5 text-center">
				<div>
					<p className="text-sm font-medium">Fill manually</p>
					<p className="mt-0.5 text-sm text-muted-foreground">
						Prefer not to link your account? No problem.
					</p>
				</div>

				<Button variant="outline" className="w-full" onClick={onStartManual}>
					Start manual form
				</Button>
			</div>
		</div>
	);
};

export default KycMethodSelect;
