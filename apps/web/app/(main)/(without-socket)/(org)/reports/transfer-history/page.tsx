import {
	getOrganizationRate,
	getTransactions,
	PAGE_LIMIT,
} from "@repo/db/queries";
import { DataRenderer } from "@repo/ui";
import { Suspense } from "react";
import RateNotConfigured from "@/components/ui/rate-not-configured";
import TransactionFiltersProvider from "@/context/TransactionFiltersProvider";
import { db } from "@/lib/db";
import { requirePermission, verifySession } from "@/lib/session";
import TransactionHistory from "../../../../../../components/features/transactions/TransactionHistory";
import { TransactionsFilter } from "../../../../../../components/features/transactions/TransactionsFilter";

const TransactionHistoryContent = async () => {
	const session = await verifySession();
	requirePermission(session, "statement", "view");

	const organizationId = session.session.activeOrganizationId as string;

	const [rate, transactions] = await Promise.all([
		getOrganizationRate(organizationId, db),
		getTransactions({
			db,
			organizationId,
			paginationOptions: { limit: PAGE_LIMIT },
		}),
	]);

	return (
		<DataRenderer
			data={rate}
			empty={{ component: <RateNotConfigured /> }}
			render={(rate) => (
				<TransactionHistory rate={rate} initialTransactions={transactions} />
			)}
		/>
	);
};

const TransactionHistoryPage = () => {
	return (
		<div className="container flex h-[calc(100dvh-4rem)] flex-col">
			<TransactionFiltersProvider>
				<div className="flex shrink-0 items-center justify-between border-b px-2 py-4">
					<div>
						<h1 className="font-space text-xl font-bold tracking-tight">
							Transfer History
						</h1>
						<p className="text-12-medium text-muted-foreground">
							Transfers sent out to clients
						</p>
					</div>
					<TransactionsFilter />
				</div>

				<div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-4">
					<Suspense fallback={null}>
						<TransactionHistoryContent />
					</Suspense>
				</div>
			</TransactionFiltersProvider>
		</div>
	);
};

export default TransactionHistoryPage;
