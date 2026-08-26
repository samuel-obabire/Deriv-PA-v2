import { DailySummary } from "@repo/db";
import { Badge, Card, CardContent, CardHeader } from "@repo/ui";
import { formatBusinessDate } from "@/lib/utils/date";
import { formatNaira, formatUSD } from "@/lib/utils/formatCurrency";

type DailySummaryListCardProps = {
	summary: DailySummary;
};

const DailySummaryListCard = ({ summary }: DailySummaryListCardProps) => {
	const {
		businessDate,
		totalAmount,
		totalSuccessfulAmount,
		totalNgnAmount,
		totalCount,
		totalSuccessful,
		totalCancelled,
		totalFailed,
	} = summary;

	return (
		<div className="flex flex-col items-center">
			<Card className="w-full max-w-175">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<p className="font-medium">{formatBusinessDate(businessDate)}</p>
						<Badge variant="outline">{totalCount} transactions</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-1.5">
					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="text-muted-foreground">Total Amount</span>
						<span className="font-semibold">{formatUSD(totalAmount)}</span>
					</div>

					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="text-muted-foreground">Successful Amount</span>
						<span>{formatUSD(totalSuccessfulAmount)}</span>
					</div>

					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="text-muted-foreground">Total NGN Amount</span>
						<span className="font-semibold">
							{formatNaira(Number(totalNgnAmount))}
						</span>
					</div>

					<div className="flex flex-wrap items-center gap-2 pt-1">
						<Badge variant="matched">{totalSuccessful} successful</Badge>
						<Badge variant="secondary">{totalCancelled} cancelled</Badge>
						<Badge variant="destructive">{totalFailed} failed</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DailySummaryListCard;
