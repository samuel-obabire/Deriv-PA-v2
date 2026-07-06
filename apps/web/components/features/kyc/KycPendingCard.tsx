import { ClientKycRecord } from "@repo/db";
import { Button, Card, CardContent } from "@repo/ui";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import ROUTES from "@/lib/constants/routes";

type Props = {
	record: ClientKycRecord;
};

const KycPendingCard = ({ record }: Props) => (
	<Card className="w-full">
		<CardContent className="flex items-center justify-between gap-4 py-4">
			<div className="min-w-0 space-y-1">
				<div className="flex items-center gap-1.5">
					<User className="size-3.5 shrink-0 text-muted-foreground" />
					<p className="truncate text-sm font-medium">{record.fullName}</p>
				</div>
				<div className="flex items-center gap-1.5">
					<Mail className="size-3.5 shrink-0 text-muted-foreground" />
					<p className="truncate text-xs text-muted-foreground">
						{record.email}
					</p>
				</div>
				<div className="flex items-center gap-1.5">
					<Phone className="size-3.5 shrink-0 text-muted-foreground" />
					<p className="truncate text-xs text-muted-foreground">
						{record.whatsappNumber}
					</p>
				</div>
			</div>

			<Button asChild size="sm" variant="outline" className="shrink-0 gap-1.5">
				<Link href={ROUTES.KYC_REVIEW(record.id)}>
					Review
					<ArrowRight className="size-3.5" />
				</Link>
			</Button>
		</CardContent>
	</Card>
);

export default KycPendingCard;
