import { randomUUID } from "node:crypto";
import { getPayouts } from "@repo/db/queries";
import { Suspense } from "react";
import AuditFilters from "@/components/audit/AuditFilters";
import { TransactionsListSkeleton } from "@/components/skeletons/TransactionListSkeleton";
import TransactionsList from "@/components/transactions/TransactionsList";
import { db } from "@/lib/db";
import { PageProps } from "@/lib/searchParams";
import { getQueryOptions } from "@/lib/searchParams/getQueryOptions";
import { payoutSearchParamsCache } from "@/lib/searchParams/payout";
import { verifySession } from "@/lib/session";
import { TransactionQuerySchema } from "@/lib/validations/pagination.schema";

const Payouts = async ({ searchParams }: PageProps) => {
	await verifySession();

	const query = await payoutSearchParamsCache.parse(searchParams);

	const queryOptions = getQueryOptions({
		query,
		schema: TransactionQuerySchema,
	});

	const transactions = queryOptions
		? await getPayouts({ db, options: queryOptions })
		: await getPayouts({ db });

	return <TransactionsList transactions={transactions} />;
};

const PayoutPage = ({ searchParams }: PageProps) => {
	return (
		<div className="container max-w-2xl space-y-3 sm:space-y-6">
			<section className="sticky p-x-2 py-4 space-y-3 z-40 top-16 bg-background">
				<p className="title-subtext text-xs font-bold uppercase">
					Monitor console
				</p>
				<h2 className="title">Payouts</h2>

				<AuditFilters />
			</section>

			<Suspense key={randomUUID()} fallback={<TransactionsListSkeleton />}>
				<Payouts searchParams={searchParams} />
			</Suspense>
		</div>
	);
};

export default PayoutPage;
