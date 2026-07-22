import { KYC_STATUS } from "@repo/db/enums";
import { Badge } from "@repo/ui";

const STATUS_BADGE_CLASSNAME: Record<KYC_STATUS, string> = {
	[KYC_STATUS.UNVERIFIED]: "border-border bg-muted text-muted-foreground",
	[KYC_STATUS.PENDING_REVIEW]: "border-pending/30 bg-pending/15 text-pending",
	[KYC_STATUS.VERIFIED]: "border-success/30 bg-success/15 text-success!",
	[KYC_STATUS.REJECTED]: "border-error/30 bg-error/15 text-error",
};

const STATUS_LABELS: Record<KYC_STATUS, string> = {
	[KYC_STATUS.UNVERIFIED]: "Unverified",
	[KYC_STATUS.PENDING_REVIEW]: "Pending review",
	[KYC_STATUS.VERIFIED]: "Verified",
	[KYC_STATUS.REJECTED]: "Rejected",
};

type Props = {
	status: KYC_STATUS;
};

export const KycStatusBadge = ({ status }: Props) => (
	<Badge variant="outline" className={STATUS_BADGE_CLASSNAME[status]}>
		{STATUS_LABELS[status]}
	</Badge>
);
