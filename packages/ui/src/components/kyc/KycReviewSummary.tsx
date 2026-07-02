import { KycReviewField } from "./KycReviewField";
import { KycReviewImage } from "./KycReviewImage";
import { KycReviewImagePlaceholder } from "./KycReviewImagePlaceholder";
import { KycReviewSection } from "./KycReviewSection";
import { KycReviewVideo } from "./KycReviewVideo";
import { KycReviewVideoPlaceholder } from "./KycReviewVideoPlaceholder";

type Props = {
	fullName: string;
	derivNickname: string;
	whatsappNumber: string;
	documentTypeLabel?: string | null;
	idFrontUrl?: string | null;
	idBackUrl?: string | null;
	selfieVideoUrl?: string | null;
	showPlaceholders?: boolean;
};

export const KycReviewSummary = ({
	fullName,
	derivNickname,
	whatsappNumber,
	documentTypeLabel,
	idFrontUrl,
	idBackUrl,
	selfieVideoUrl,
	showPlaceholders = true,
}: Props) => {
	const hasDocuments = Boolean(documentTypeLabel);

	return (
		<div className="space-y-6">
			<KycReviewSection title="Identity">
				<KycReviewField label="Full name" value={fullName} />
				<KycReviewField label="Deriv nickname" value={derivNickname} />
			</KycReviewSection>

			<KycReviewSection title="Contact">
				<KycReviewField label="WhatsApp number" value={whatsappNumber} />
			</KycReviewSection>

			{hasDocuments && (
				<KycReviewSection title="Documents">
					<KycReviewField
						label="Document type"
						value={documentTypeLabel ?? ""}
					/>

					{(idFrontUrl || showPlaceholders) && (
						<div>
							<p className="text-xs text-muted-foreground">Front of document</p>
							<div className="mt-1">
								{idFrontUrl ? (
									<KycReviewImage imageUrl={idFrontUrl} label="Front of document" />
								) : (
									<KycReviewImagePlaceholder />
								)}
							</div>
						</div>
					)}

					{(idBackUrl || showPlaceholders) && (
						<div>
							<p className="text-xs text-muted-foreground">Back of document</p>
							<div className="mt-1">
								{idBackUrl ? (
									<KycReviewImage imageUrl={idBackUrl} label="Back of document" />
								) : (
									<KycReviewImagePlaceholder />
								)}
							</div>
						</div>
					)}

					{(selfieVideoUrl || showPlaceholders) && (
						<div>
							<p className="text-xs text-muted-foreground">Selfie video</p>
							<div className="mt-1">
								{selfieVideoUrl ? (
									<KycReviewVideo videoUrl={selfieVideoUrl} />
								) : (
									<KycReviewVideoPlaceholder />
								)}
							</div>
						</div>
					)}
				</KycReviewSection>
			)}
		</div>
	);
};

export default KycReviewSummary;
