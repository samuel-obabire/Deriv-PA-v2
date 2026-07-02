import { getValidClientKycInvitationByTokenHash } from "@repo/db/queries";
import { DataRenderer, InvalidLink } from "@repo/ui";
import { Suspense } from "react";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import KycRecordUpdate from "./kyc/components/KycRecordUpdate";

const KycContent = async ({
	searchParams,
}: {
	searchParams: PageProps<typeof ROUTES.KYC>["searchParams"];
}) => {
	const resolvedParams = await searchParams;
	const token =
		typeof resolvedParams.token === "string" ? resolvedParams.token : null;

	await verifySession(token ? `${ROUTES.HOME}?token=${token}` : ROUTES.HOME);

	if (!token) {
		return <InvalidLink message="No invitation token found in this link." />;
	}

	const invitation = await getValidClientKycInvitationByTokenHash(token, db);

	return (
		<DataRenderer
			data={invitation}
			empty={{
				component: (
					<InvalidLink message="This link has expired or is no longer valid. Please request a new one." />
				),
			}}
			render={(invitation) => (
				<KycRecordUpdate
					customerType={invitation.customerType}
					token={token}
					organizationId={invitation.organizationId}
				/>
			)}
		/>
	);
};

const KycDataUpdatePage = ({ searchParams }: PageProps<typeof ROUTES.KYC>) => {
	return (
		<Suspense fallback={null}>
			<KycContent searchParams={searchParams} />
		</Suspense>
	);
};

export default KycDataUpdatePage;
