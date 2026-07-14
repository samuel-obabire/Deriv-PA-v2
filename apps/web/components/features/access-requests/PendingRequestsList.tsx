"use client";

import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	DataRenderer,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { toast } from "sonner";
import ApproveAccessDialog from "@/components/features/access-requests/ApproveAccessDialog";
import RefreshButton from "@/components/ui/refresh-button";
import { reviewAccessRequest } from "@/lib/actions/accessRequest/reviewAccessRequest";

export type PendingAccessRequest = {
	id: string;
	targetUserId: string;
	createdAt: Date;
	userName: string;
	userEmail: string;
};

type Props = {
	pendingPromise: Promise<PendingAccessRequest[]>;
};

const PendingRequestsList = ({ pendingPromise }: Props) => {
	const pending = use(pendingPromise);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleReview = (
		grantId: string,
		action: "approve" | "reject",
		hours?: number,
	) => {
		startTransition(async () => {
			const [result, error] = await tryCatch(() =>
				reviewAccessRequest(
					action === "approve"
						? { grantId, action, hours }
						: { grantId, action },
				),
			);

			if (error) {
				toast.error(error.message);
				return;
			}

			if (!result.success) {
				toast.error(result.error?.message ?? `Failed to ${action} request`);
				return;
			}

			toast.success(
				action === "approve"
					? "Access request approved"
					: "Access request rejected",
			);
			router.refresh();
		});
	};

	return (
		<DataRenderer
			data={pending}
			empty={{
				title: "No pending requests",
				message: "New access requests will appear here.",
				action: <RefreshButton />,
			}}
			render={(requests) => (
				<div className="space-y-3 pt-4">
					{requests.map((req) => (
						<Card key={req.id}>
							<CardHeader>
								<div className="flex items-center justify-between gap-4">
									<div>
										<CardTitle className="text-base">{req.userName}</CardTitle>
										<CardDescription>{req.userEmail}</CardDescription>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="xs"
											className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
											disabled={isPending}
											onClick={() => handleReview(req.id, "reject")}
										>
											<XCircle className="size-4" />
											Reject
										</Button>
										<ApproveAccessDialog
											isPending={isPending}
											onApprove={(hours) =>
												handleReview(req.id, "approve", hours)
											}
										/>
									</div>
								</div>
							</CardHeader>
						</Card>
					))}
				</div>
			)}
		/>
	);
};

export default PendingRequestsList;
