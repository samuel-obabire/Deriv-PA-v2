"use client";

import { KYC_REJECTION_REASON } from "@repo/db/enums";
import {
	Button,
	ConfirmDialog,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { reviewKycRecord } from "@/lib/actions/kyc/reviewKycRecord";
import { REJECTION_REASON_LABELS } from "@/lib/constants/kyc";
import ROUTES from "@/lib/constants/routes";

type Props = {
	recordId: string;
};

const KycReviewActions = ({ recordId }: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [rejectionReason, setRejectionReason] = useState<
		KYC_REJECTION_REASON | undefined
	>(undefined);

	const handleApprove = () => {
		startTransition(async () => {
			const result = await reviewKycRecord({ recordId, action: "approve" });
			if (!result.success) {
				toast.error(result.error?.message ?? "Failed to approve record");
				return;
			}
			toast.success("KYC record approved");
			router.push(ROUTES.KYC);
		});
	};

	const handleReject = () => {
		startTransition(async () => {
			const result = await reviewKycRecord({
				recordId,
				action: "reject",
				rejectionReason,
			});
			if (!result.success) {
				toast.error(result.error?.message ?? "Failed to reject record");
				return;
			}
			toast.success("KYC record rejected");
			router.push(ROUTES.KYC);
		});
	};

	return (
		<div className="flex gap-3">
			<ConfirmDialog
				trigger={
					<Button
						variant="outline"
						className="flex-1 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
						disabled={isPending}
					>
						<XCircle className="size-4" />
						Reject
					</Button>
				}
				title="Reject KYC submission?"
				description="Select a reason for rejection. The client will need to resubmit."
				confirmLabel="Reject"
				confirmVariant="destructive"
				icon={<XCircle className="size-5 text-destructive" />}
				isPending={isPending}
				onConfirm={handleReject}
			>
				<div className="space-y-1.5">
					<Label className="text-xs font-medium text-muted-foreground">
						Reason
					</Label>
					<Select
						value={rejectionReason}
						onValueChange={(v) => setRejectionReason(v as KYC_REJECTION_REASON)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a reason" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(REJECTION_REASON_LABELS).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</ConfirmDialog>

			<ConfirmDialog
				trigger={
					<Button className="flex-1 gap-2" disabled={isPending}>
						<CheckCircle2 className="size-4" />
						Approve
					</Button>
				}
				title="Approve KYC submission?"
				description="This will mark the client as verified."
				confirmLabel="Approve"
				icon={<CheckCircle2 className="size-5 text-primary" />}
				isPending={isPending}
				onConfirm={handleApprove}
			/>
		</div>
	);
};

export default KycReviewActions;
