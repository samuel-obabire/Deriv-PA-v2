"use client";

import { Button, Copy, Input } from "@repo/ui";
import { useState } from "react";
import { createKycInvitation } from "@/lib/actions/kyc/createKycInvitation";
import CreateKycInvitationForm from "../forms/CreateKycInvitation";

const KycInvitationSection = () => {
	const [inviteUrl, setInviteUrl] = useState<string | null>(null);

	if (inviteUrl) {
		return (
			<div className="space-y-4">
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

				<Button variant="outline" size="sm" onClick={() => setInviteUrl(null)}>
					Generate Another
				</Button>
			</div>
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
