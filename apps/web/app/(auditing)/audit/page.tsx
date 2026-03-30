import { getPayouts } from "@repo/db/queries";
import { Suspense } from "react";
import AuditFilters from "@/components/audit/AuditFilters";
import { TransactionsListSkeleton } from "@/components/skeletons/TransactionListSkeleton";
import TransactionsList from "@/components/transactions/TransactionsList";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const AuditList = async () => {
	const transactions = await getPayouts({
		db,
	});

	return <TransactionsList transactions={transactions} />;
};

const AuditPage = async () => {
	await verifySession();

	return (
		<div className="container max-w-2xl space-y-3 sm:space-y-6">
			<section className="sticky p-x-2 py-4 space-y-3 z-40 top-16 bg-background">
				<p className="title-subtext text-xs font-bold uppercase">
					Monitor console
				</p>
				<h2 className="title">Payouts</h2>

				<AuditFilters />
			</section>

			<Suspense fallback={<TransactionsListSkeleton />}>
				<AuditList />
			</Suspense>
		</div>
	);
};

export default AuditPage;
