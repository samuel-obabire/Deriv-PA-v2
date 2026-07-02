"use client";

import { ClientKycRecord } from "@repo/db";
import { KycReviewSummary } from "@repo/ui";
import { useEffect, useState } from "react";
import { getKycSignedUrl } from "@/lib/actions/kyc/getKycSignedUrl";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants/kyc";
import KycReviewActions from "./KycReviewActions";

type SignedUrls = {
	idFrontKey: string | null;
	idBackKey: string | null;
	selfieVideoKey: string | null;
};

type Props = {
	record: ClientKycRecord;
};

const KycReviewClient = ({ record }: Props) => {
	const [signedUrls, setSignedUrls] = useState<SignedUrls>({
		idFrontKey: null,
		idBackKey: null,
		selfieVideoKey: null,
	});

	useEffect(() => {
		const fetchUrls = async () => {
			const [front, back, video] = await Promise.all([
				record.idFrontKey
					? getKycSignedUrl(record.idFrontKey).then((r) =>
							r.success ? (r.data?.url ?? null) : null,
						)
					: null,
				record.idBackKey
					? getKycSignedUrl(record.idBackKey).then((r) =>
							r.success ? (r.data?.url ?? null) : null,
						)
					: null,
				record.selfieVideoKey
					? getKycSignedUrl(record.selfieVideoKey).then((r) =>
							r.success ? (r.data?.url ?? null) : null,
						)
					: null,
			]);

			setSignedUrls({
				idFrontKey: front,
				idBackKey: back,
				selfieVideoKey: video,
			});
		};

		fetchUrls();
	}, [record.idFrontKey, record.idBackKey, record.selfieVideoKey]);

	return (
		<div className="space-y-8">
			<KycReviewSummary
				fullName={record.fullName}
				derivNickname={record.derivNickname}
				whatsappNumber={record.whatsappNumber}
				documentTypeLabel={
					record.documentType ? DOCUMENT_TYPE_LABELS[record.documentType] : null
				}
				idFrontUrl={signedUrls.idFrontKey}
				idBackUrl={signedUrls.idBackKey}
				selfieVideoUrl={signedUrls.selfieVideoKey}
			/>

			<KycReviewActions recordId={record.id} />
		</div>
	);
};

export default KycReviewClient;
