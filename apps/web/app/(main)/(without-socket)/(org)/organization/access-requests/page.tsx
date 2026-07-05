import {
	getActiveAccessGrantsByOrg,
	getPendingAccessRequestsByOrg,
} from "@repo/db/queries";
import { Suspense } from "react";
import AccessRequestsTabs from "@/components/features/access-requests/AccessRequestsTabs";
import { db } from "@/lib/db";
import { requirePermission, verifySession } from "@/lib/session";

const AccessRequestsContent = async () => {
	const session = await verifySession();
	requirePermission(session, "access_request", "view");
	const organizationId = session.session.activeOrganizationId as string;

	const pendingPromise = getPendingAccessRequestsByOrg(organizationId, db);
	const activePromise = getActiveAccessGrantsByOrg(organizationId, db);

	return (
		<Suspense fallback={<div>Loading requests...</div>}>
			<AccessRequestsTabs
				pendingPromise={pendingPromise}
				activePromise={activePromise}
			/>
		</Suspense>
	);
};

const AccessRequestsPage = () => {
	return (
		<div className="container max-w-2xl py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="title">Access Requests</h1>
				<p className="text-sm text-muted-foreground">
					Review elevated access requests and manage active grants.
				</p>
			</header>

			<Suspense fallback={null}>
				<AccessRequestsContent />
			</Suspense>
		</div>
	);
};

export default AccessRequestsPage;
