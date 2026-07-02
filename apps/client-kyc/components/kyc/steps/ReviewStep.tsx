"use client";

import { CLIENT_CUSTOMER_TYPE } from "@repo/db/enums";
import { Button, KycReviewSummary } from "@repo/ui";
import { DOCUMENT_TYPE_CONFIG } from "@/lib/constants/kyc";
import type { KycFormData } from "@/lib/validations/kyc";

type Props = {
	formData: KycFormData;
	customerType: CLIENT_CUSTOMER_TYPE;
	onBack: () => void;
	onSubmit: () => void;
	isPending: boolean;
};

const ReviewStep = ({
	formData,
	customerType,
	onBack,
	onSubmit,
	isPending,
}: Props) => {
	const isNew = customerType === CLIENT_CUSTOMER_TYPE.NEW;

	return (
		<div>
			<p className="mb-6 text-sm text-muted-foreground">
				Please review your details before submitting.
			</p>

			<KycReviewSummary
				fullName={formData.fullName ?? ""}
				derivNickname={formData.derivNickname ?? ""}
				whatsappNumber={formData.whatsappNumber ?? ""}
				documentTypeLabel={
					isNew && formData.documentType
						? DOCUMENT_TYPE_CONFIG[formData.documentType].label
						: null
				}
				idFrontUrl={formData.idFrontPreview}
				idBackUrl={formData.idBackPreview}
				selfieVideoUrl={formData.selfieVideoPreview}
				showPlaceholders={false}
			/>

			<div className="mt-8 flex gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={isPending}
					className="flex-1"
				>
					Back
				</Button>
				<Button
					type="button"
					onClick={onSubmit}
					disabled={isPending}
					className="flex-1"
				>
					{isPending ? "Submitting…" : "Submit"}
				</Button>
			</div>
		</div>
	);
};

export default ReviewStep;
