import { getAllOrganizationCurrencies } from "@repo/db/queries";
import { Suspense } from "react";
import TokenCard from "@/components/settings/TokenCard";
import TokenCardSkeleton from "@/components/skeletons/TokenCardSkeleton";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { buildConfiguredCurrencies } from "@/lib/utils/deriv";

const Tokens = async () => {
	const session = await verifySession({
		resource: "auth_provider",
		action: "manage",
	});

	const userCurrencies = await getAllOrganizationCurrencies(
		session.session.activeOrganizationId,
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
		<div className="container max-w-2xl space-y-6 mt-8">
			<header>
				<h1 className="title text-2xl">Deriv API Tokens</h1>
				<p className="title-subtext">
					Manage payment tokens per currency. Tokens are write-only. They cannot
					be viewed after saving.
				</p>
			</header>

			<section className="space-y-4">
				<Suspense fallback={<TokenCardSkeleton />}>
					<Tokens />
				</Suspense>
			</section>
		</div>
	);
};

export default DerivTokensPage;
