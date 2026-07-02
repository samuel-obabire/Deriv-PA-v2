import { ClientKycRecord } from "@repo/db";
import { DataRenderer } from "@repo/ui";
import KycPendingCard from "./KycPendingCard";

type Props = {
	records: ClientKycRecord[];
};

const emptyState = {
	title: "No pending reviews",
	message:
		"There are no KYC submissions awaiting review for your organization.",
};

const KycPendingList = ({ records }: Props) => (
	<DataRenderer
		data={records}
		empty={emptyState}
		render={(data) => (
			<div className="space-y-3">
				{data.map((record) => (
					<KycPendingCard key={record.id} record={record} />
				))}
			</div>
		)}
	/>
);

export default KycPendingList;
