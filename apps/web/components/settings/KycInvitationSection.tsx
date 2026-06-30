"use client";

import { Button, Card, CardContent, CardFooter, Copy, Input } from "@repo/ui";
import { useState } from "react";
import { createKycInvitation } from "@/lib/actions/kyc/createKycInvitation";
import CreateKycInvitationForm from "../forms/CreateKycInvitation";

const KycInvitationSection = () => {
	const [inviteUrl, setInviteUrl] = useState<string | null>(null);

	if (inviteUrl) {
		return (
			<Card className="w-full bg-muted">
				<CardContent className="space-y-3 pt-2">
					<p className="text-sm text-muted-foreground">
						Share this link with the client. It expires in 1 hour.
					</p>
					<div className="flex items-center gap-2">
						<Input
							readOnly
							value={inviteUrl}
							className="font-mono text-xs no-ring"
						/>
						<Copy value={inviteUrl} />
					</div>
				</CardContent>
				<CardFooter>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setInviteUrl(null)}
					>
						Generate Another
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<CreateKycInvitationForm
			onSubmit={createKycInvitation}
			onSuccess={setInviteUrl}
		/>
	);
};

export default KycInvitationSection;
