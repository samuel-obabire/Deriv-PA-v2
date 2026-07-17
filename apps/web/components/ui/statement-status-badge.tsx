import {
	DERIV_WALLET_TRANSACTION_STATUS,
	type DerivWalletTransactionStatus,
} from "@repo/deriv";
import { Badge } from "@repo/ui";



const STATUS_BADGE_CLASSNAME: Record<DerivWalletTransactionStatus, string> = {
	pending: "border-pending/30 bg-pending/15 text-pending",
	processing: "border-blue-500/30 bg-blue-500/15 text-blue-500",
	complete: "border-success/30 bg-success/15 text-success!",
	failed: "border-error/30 bg-error/15 text-error",
	cancelled: "border-border bg-muted text-muted-foreground",
	reverted: "border-flagged/5 bg-flagged/10 text-flagged",
};

const UNKNOWN_STATUS_CLASSNAME = "border-border text-foreground";

function isKnownStatus(status: string): status is DerivWalletTransactionStatus {
	return (DERIV_WALLET_TRANSACTION_STATUS as readonly string[]).includes(
		status,
	);
}

type StatementStatusBadgeProps = {
	status: string;
};

// Deriv sends transaction_status as a bare string, so anything outside our
// known set still renders (raw value, neutral color) instead of crashing.
export const StatementStatusBadge = ({ status }: StatementStatusBadgeProps) => {
	const className = isKnownStatus(status)
		? STATUS_BADGE_CLASSNAME[status]
		: UNKNOWN_STATUS_CLASSNAME;
	const label = status.charAt(0).toUpperCase() + status.slice(1);

	return (
		<Badge variant="outline" className={className}>
			{label}
		</Badge>
	);
};
