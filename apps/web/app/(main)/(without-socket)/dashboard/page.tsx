import { Suspense } from "react";
import OrganizationManager from "@/components/features/dashboard/OrganizationManager";
import { verifySession } from "@/lib/session";

const Dashboard = async () => {
	await verifySession();

	return <OrganizationManager />;
};

const DashBoardPage = () => {
	return (
		<div className="container space-y-6 mt-12 mb-10">
			<header>
				<h2 className="title">Create/Switch Organization</h2>
				<p className="title-subtext">
					All actions apply to your selected organization
				</p>
			</header>

			<Suspense fallback={<div>Loading...</div>}>
				<Dashboard />
			</Suspense>
		</div>
	);
};

export default DashBoardPage;
