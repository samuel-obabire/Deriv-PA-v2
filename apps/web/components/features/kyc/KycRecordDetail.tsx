"use client";

import { ClientKycRecord } from "@repo/db";
import { KYC_STATUS } from "@repo/db/enums";
import { editClientKycRecordAction } from "@/lib/actions/kyc/editClientKycRecord";
import EditClientKycRecordForm from "../forms/EditClientKycRecord";
import InvalidateKycRecordButton from "./InvalidateKycRecordButton";
import { KycStatusBadge } from "./KycStatusBadge";

type Props = {
	record: ClientKycRecord;
};

const KycRecordDetail = ({ record }: Props) => (
	<div className="space-y-8">
		<div className="flex items-center justify-between gap-4">
			<KycStatusBadge status={record.status} />
			{record.status === KYC_STATUS.VERIFIED && (
				<InvalidateKycRecordButton recordId={record.id} />
			)}
		</div>

		<EditClientKycRecordForm
			record={record}
			onSubmit={editClientKycRecordAction}
		/>
	</div>
);

export default KycRecordDetail;
