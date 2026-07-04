import { getElevatedAccessGrantBySessionId } from "@repo/db/queries";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import RequestAccessCard from "./RequestAccessCard";

const RequestAccessGate = async () => {
	const session = await verifySession();
	const organizationId = session.session.activeOrganizationId as string;
	const existingRequest = await getElevatedAccessGrantBySessionId(
		session.session.id,
		organizationId,
		db,
	);

	return (
		<RequestAccessCard
			grantId={existingRequest?.id ?? null}
			isPending={Boolean(existingRequest && !existingRequest.isGranted)}
		/>
	);
};

export default RequestAccessGate;
