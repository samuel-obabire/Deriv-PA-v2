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
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { invalidateKycRecordAction } from "@/lib/actions/kyc/invalidateKycRecord";
import { REJECTION_REASON_LABELS } from "@/lib/constants/kyc";
import ROUTES from "@/lib/constants/routes";

type Props = {
	recordId: string;
};

const InvalidateKycRecordButton = ({ recordId }: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [rejectionReason, setRejectionReason] = useState<KYC_REJECTION_REASON>(
		KYC_REJECTION_REASON.INCOMPLETE_SUBMISSION,
	);

	const handleInvalidate = () => {
		startTransition(async () => {
			const result = await invalidateKycRecordAction({
				recordId,
				rejectionReason,
			});
			if (!result.success) {
				toast.error(result.error?.message ?? "Failed to invalidate record");
				return;
			}
			toast.success("KYC record invalidated");
			router.push(ROUTES.KYC_RECORDS);
		});
	};

	return (
		<ConfirmDialog
			trigger={
				<Button
					variant="outline"
					className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
					disabled={isPending}
				>
					<ShieldAlert className="size-4" />
					Invalidate
				</Button>
			}
			title="Invalidate this KYC record?"
			description="The client will no longer be considered verified. Select a reason for the record."
			confirmLabel="Invalidate"
			confirmVariant="destructive"
			icon={<ShieldAlert className="size-5 text-destructive" />}
			isPending={isPending}
			onConfirm={handleInvalidate}
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
	);
};

export default InvalidateKycRecordButton;
