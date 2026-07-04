"use client";

import {
	Badge,
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	ConfirmDialog,
	DataRenderer,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { ShieldOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { toast } from "sonner";
import RefreshButton from "@/components/ui/refresh-button";
import { revokeAccessGrant } from "@/lib/actions/accessRequest/revokeAccessGrant";

export type ActiveAccessGrant = {
	id: string;
	targetUserId: string;
	expiresAt: Date | null;
	grantedAt: Date | null;
	userName: string;
	userEmail: string;
};

type Props = {
	activePromise: Promise<ActiveAccessGrant[]>;
};

const ActiveGrantsList = ({ activePromise }: Props) => {
	const active = use(activePromise);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleRevoke = (grantId: string) => {
		startTransition(async () => {
			const [result, error] = await tryCatch(() =>
				revokeAccessGrant({ grantId }),
			);

			if (error) {
				toast.error(error.message);
				return;
			}

			if (!result.success) {
				toast.error(result.error?.message ?? "Failed to revoke access");
				return;
			}

			toast.success("Access revoked");
			router.refresh();
		});
	};

	return (
		<DataRenderer
			data={active}
			empty={{
				title: "No active access grants",
				message: "Approved requests will appear here.",
				action: <RefreshButton />,
			}}
			render={(grants) => (
				<div className="space-y-3 pt-4">
					{grants.map((grant) => (
						<Card key={grant.id}>
							<CardHeader>
								<div className="flex items-center justify-between gap-4">
									<div>
										<CardTitle className="text-base">
											{grant.userName}
										</CardTitle>
										<CardDescription>{grant.userEmail}</CardDescription>
										{grant.expiresAt && (
											<Badge variant="secondary" className="mt-2">
												Expires {grant.expiresAt.toLocaleString()}
											</Badge>
										)}
									</div>
									<ConfirmDialog
										trigger={
											<Button
												variant="outline"
												size="sm"
												className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
												disabled={isPending}
											>
												<ShieldOff className="size-4" />
												Revoke
											</Button>
										}
										title="Revoke elevated access?"
										description="The user will immediately lose elevated access and must request it again."
										confirmLabel="Revoke"
										confirmVariant="destructive"
										icon={<ShieldOff className="size-5 text-destructive" />}
										isPending={isPending}
										onConfirm={() => handleRevoke(grant.id)}
									/>
								</div>
							</CardHeader>
						</Card>
					))}
				</div>
			)}
		/>
	);
};

export default ActiveGrantsList;
