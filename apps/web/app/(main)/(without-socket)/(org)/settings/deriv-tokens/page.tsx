import { getAllOrganizationCurrencies } from "@repo/db/queries";
import { Suspense } from "react";
import TokenCard from "@/components/settings/TokenCard";
import TokenCardSkeleton from "@/components/skeletons/TokenCardSkeleton";
import { db } from "@/lib/db";
import { requirePermission, verifySession } from "@/lib/session";
import { buildConfiguredCurrencies } from "@/lib/utils/deriv";

const Tokens = async () => {
	const session = await verifySession();
	requirePermission(session, "auth_provider", "manage");

	const userCurrencies = await getAllOrganizationCurrencies(
		session.session.activeOrganizationId as string,
		db,
	);

	const configuredCurrencies = buildConfiguredCurrencies(userCurrencies);
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{configuredCurrencies.map((token) => (
				<TokenCard key={token.code} token={token} />
			))}
		</div>
	);
};

const DerivTokensPage = () => {
	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Deriv API Tokens</h1>
				<p className="text-sm text-muted-foreground">
					Manage payment tokens per currency. Tokens are write-only and cannot
					be viewed after saving.
				</p>
			</header>

			<Suspense fallback={<TokenCardSkeleton />}>
				<Tokens />
			</Suspense>
		</div>
	);
};

export default DerivTokensPage;
