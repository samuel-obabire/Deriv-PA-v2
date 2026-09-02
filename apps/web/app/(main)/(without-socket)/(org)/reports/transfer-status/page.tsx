import TransferStatusChecker from "@/components/features/transactions/TransferStatusChecker";
import { requirePermission, verifySession } from "@/lib/session";

type TransferStatusPageProps = {
	searchParams: Promise<{ id?: string }>;
};

const TransferStatusPage = async ({
	searchParams,
}: TransferStatusPageProps) => {
	const session = await verifySession();
	requirePermission(session, "statement", "view");

	const { id } = await searchParams;

	return (
		<div className="container flex h-[calc(100dvh-4rem)] flex-col">
			<div className="shrink-0 border-b px-2 py-4">
				<h1 className="font-space text-xl font-bold tracking-tight">
					Confirm Transfer Status
				</h1>
				<p className="text-12-medium text-muted-foreground">
					Check a transfer&apos;s status directly with Deriv
				</p>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
				<TransferStatusChecker initialTransactionId={id} />
			</div>
		</div>
	);
};

export default TransferStatusPage;
