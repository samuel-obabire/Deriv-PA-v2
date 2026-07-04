import { CLIENT_CUSTOMER_TYPE, KYC_STATUS } from "@repo/db/enums";
import {
	getClientKycRecordByEmail,
	getValidClientKycInvitationByTokenHash,
} from "@repo/db/queries";
import { Banner, DataRenderer, InvalidLink } from "@repo/ui";
import { Suspense } from "react";
import KycPageClient from "@/components/kyc/KycPageClient";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const KycForm = async ({
	token,
	organizationId,
	customerType,
	email,
}: {
	token: string;
	organizationId: string;
	customerType: CLIENT_CUSTOMER_TYPE;
	email: string;
}) => {
	const kycRecord = await getClientKycRecordByEmail(
		{ email, organizationId },
		db,
	);

	if (!kycRecord) {
		return <KycPageClient token={token} customerType={customerType} />;
	}

	const {
		idBackKey,
		idFrontKey,
		selfieVideoKey,
		documentType,
		...restKycRecord
	} = kycRecord;

	const allowedStatuses = [KYC_STATUS.UNVERIFIED, KYC_STATUS.REJECTED];
	if (!allowedStatuses.includes(restKycRecord.status)) {
		return (
			<InvalidLink message="This link is no longer valid. Your KYC submission has already been received." />
		);
	}

	return (
		<>
			{restKycRecord.status === KYC_STATUS.REJECTED &&
				restKycRecord.rejectionReason && (
					<Banner
						variant="destructive"
						title="Your previous submission was rejected"
						message={restKycRecord.rejectionReason}
					/>
				)}
			<KycPageClient
				token={token}
				customerType={customerType}
				kycData={restKycRecord}
				submissionType="update"
			/>
		</>
	);
};

const KycContent = async ({
	searchParams,
}: {
	searchParams: PageProps<typeof ROUTES.KYC>["searchParams"];
}) => {
	const resolvedParams = await searchParams;
	const token =
		typeof resolvedParams.token === "string" ? resolvedParams.token : null;

	if (!token) {
		return <InvalidLink message="No invitation token found in this link." />;
	}

	const sessionPromise = verifySession(
		token ? `${ROUTES.KYC}?token=${token}` : ROUTES.KYC,
	);

	const invitationPromise = await getValidClientKycInvitationByTokenHash(
		token,
		db,
	);

	const [session, invitation] = await Promise.all([
		sessionPromise,
		invitationPromise,
	]);

	return (
		<DataRenderer
			data={invitation}
			empty={{
				component: (
					<InvalidLink message="This link has expired or is no longer valid. Please request a new one." />
				),
			}}
			render={(invitation) => (
				<KycForm
					token={token}
					organizationId={invitation.organizationId}
					customerType={invitation.customerType}
					email={session.user.email}
				/>
			)}
		/>
	);
};

const KycPage = ({ searchParams }: PageProps<typeof ROUTES.KYC>) => {
	return (
		<Suspense fallback={null}>
			<KycContent searchParams={searchParams} />
		</Suspense>
	);
};

export default KycPage;
