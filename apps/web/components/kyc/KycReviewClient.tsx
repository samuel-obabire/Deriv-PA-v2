"use client";

import { ClientKycRecord } from "@repo/db";
import { KycReviewSummary } from "@repo/ui";
import { useEffect, useState } from "react";
import { getKycSignedUrl } from "@/lib/actions/kyc/getKycSignedUrl";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants/kyc";
import KycReviewActions from "./KycReviewActions";

type SignedUrls = {
	idFrontUrl: string | null;
	idBackUrl: string | null;
	selfieVideoUrl: string | null;
};

type Props = {
	record: ClientKycRecord;
};

const KycReviewClient = ({ record }: Props) => {
	const [signedUrls, setSignedUrls] = useState<SignedUrls>({
		idFrontUrl: null,
		idBackUrl: null,
		selfieVideoUrl: null,
	});

	useEffect(() => {
		const fetchUrls = async () => {
			const [front, back, video] = await Promise.all([
				record.idFrontUrl
					? getKycSignedUrl(record.idFrontUrl).then((r) =>
							r.success ? (r.data?.url ?? null) : null,
						)
					: null,
				record.idBackUrl
					? getKycSignedUrl(record.idBackUrl).then((r) =>
							r.success ? (r.data?.url ?? null) : null,
						)
					: null,
				record.selfieVideoUrl
					? getKycSignedUrl(record.selfieVideoUrl).then((r) =>
							r.success ? (r.data?.url ?? null) : null,
						)
					: null,
			]);

			setSignedUrls({
				idFrontUrl: front,
				idBackUrl: back,
				selfieVideoUrl: video,
			});
		};

		fetchUrls();
	}, [record.idFrontUrl, record.idBackUrl, record.selfieVideoUrl]);

	return (
		<div className="space-y-8">
			<KycReviewSummary
				fullName={record.fullName}
				derivNickname={record.derivNickname}
				whatsappNumber={record.whatsappNumber}
				documentTypeLabel={
					record.documentType ? DOCUMENT_TYPE_LABELS[record.documentType] : null
				}
				idFrontUrl={signedUrls.idFrontUrl}
				idBackUrl={signedUrls.idBackUrl}
				selfieVideoUrl={signedUrls.selfieVideoUrl}
			/>

			<KycReviewActions recordId={record.id} />
		</div>
	);
};

export default KycReviewClient;
