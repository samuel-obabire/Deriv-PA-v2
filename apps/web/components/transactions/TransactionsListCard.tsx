import { PayoutStatus } from "@repo/db";
import { formatNaira } from "@/utils/formatNaira";
import { Badge } from "../ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
} from "../ui/card";

type TransactionsListCardProps = {
	amountNgn: string;
	createdAt: Date;
	recipientName: string;
	status: PayoutStatus;
};

const TransactionsListCard = ({
	amountNgn,
	createdAt,
	recipientName,
	status,
}: TransactionsListCardProps) => {
	return (
		<Card className="bg-muted">
			<CardHeader>
				{/* <CardTitle className="text-primary bg-muted-foreground/20 p-y-1 px-1.5 font-space rounded-md w-fit">
									{id}
								</CardTitle> */}
				<div>
					<CardDescription className="text-foreground font-bold text-lg">
						{recipientName}
					</CardDescription>

					<p className="text-primary font-medium">{createdAt.toUTCString()}</p>
				</div>

				<CardAction>
					<Badge variant={status.toLowerCase() as Lowercase<PayoutStatus>}>
						{status}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between">
					<div className="flex flex-col">
						{/* <span className="text-primary font-bold font-heading">
											Amount (USD)
										</span>
										<span>2,450.00</span> */}
					</div>

					<div className="flex flex-col text-right">
						<span className="text-primary font-bold">Settlement (NGN)</span>
						<span>{formatNaira(+amountNgn)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default TransactionsListCard;
