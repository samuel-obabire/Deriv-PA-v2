import { Spinner } from "@repo/ui";
import { Suspense } from "react";
import OrganizationManager from "@/components/features/dashboard/OrganizationManager";
import { verifySession } from "@/lib/session";

const Dashboard = async () => {
	await verifySession();

	return <OrganizationManager />;
};

const DashBoardPage = () => {
	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Create/Switch Organization</h1>
				<p className="text-sm text-muted-foreground">
					All actions apply to your selected organization
				</p>
			</header>

			<Suspense fallback={<Spinner className="mx-auto size-6" />}>
				<Dashboard />
			</Suspense>
		</div>
	);
};

export default DashBoardPage;
