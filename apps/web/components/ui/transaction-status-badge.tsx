import { TRANSACTION_STATUS } from "@repo/db/enums";
import { Badge } from "@repo/ui";

type BadgeVariant =
	| "outline"
	| "default"
	| "matched"
	| "destructive"
	| "secondary";

const STATUS_BADGE_VARIANT: Record<string, BadgeVariant> = {
	[TRANSACTION_STATUS.PENDING]: "outline",
	[TRANSACTION_STATUS.PROCESSING]: "default",
	[TRANSACTION_STATUS.COMPLETED]: "matched",
	[TRANSACTION_STATUS.FAILED]: "destructive",
	[TRANSACTION_STATUS.CANCELLED]: "secondary",
};

type TransactionStatusBadgeProps = {
	status: string;
};

export const TransactionStatusBadge = ({
	status,
}: TransactionStatusBadgeProps) => {
	return (
		<Badge variant={STATUS_BADGE_VARIANT[status] ?? "outline"}>{status}</Badge>
	);
};
