import { CLIENT_CUSTOMER_TYPE, KYC_STATUS } from "@repo/db/enums";
import { getClientKycRecordByEmail } from "@repo/db/queries";
import { Banner, DataRenderer, InvalidLink } from "@repo/ui";
import KycPageClient from "@/components/kyc/KycPageClient";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

type Props = {
	token: string;
	customerType: CLIENT_CUSTOMER_TYPE;
	organizationId: string;
};

const KycRecordUpdate = async ({
	customerType,
	token,
	organizationId,
}: Props) => {
	const session = await verifySession();

	const kycRecord = await getClientKycRecordByEmail(
		{
			email: session.user.email,
			organizationId,
		},
		db,
	);

	return (
		<DataRenderer
			data={kycRecord}
			empty={{
				component: (
					<InvalidLink message="This link has expired or is no longer valid. Please request a new one." />
				),
			}}
			render={({
				idBackKey,
				idFrontKey,
				selfieVideoKey,
				documentType,
				...kycRecord
			}) => {
				const allowedStatuses = [KYC_STATUS.UNVERIFIED, KYC_STATUS.REJECTED];
				if (!allowedStatuses.includes(kycRecord.status)) {
					return (
						<InvalidLink message="This link is no longer valid. Your KYC submission has already been received." />
					);
				}
				return (
					<>
						{kycRecord.status === KYC_STATUS.REJECTED &&
							kycRecord.rejectionReason && (
								<Banner
									variant="destructive"
									title="Your previous submission was rejected"
									message={kycRecord.rejectionReason}
								/>
							)}
						<KycPageClient
							token={token}
							customerType={customerType}
							kycData={kycRecord}
							submissionType={"update"}
						/>
					</>
				);
			}}
		/>
	);
};

export default KycRecordUpdate;
