"use client";

import { CLIENT_CUSTOMER_TYPE } from "@repo/db/enums";
import { Button } from "@repo/ui";
import Image from "next/image";
import KycVideo from "@/components/kyc/KycVideo";
import { DOCUMENT_TYPE_CONFIG } from "@/lib/constants/kyc";
import type { KycFormData } from "@/lib/validations/kyc";

type Props = {
	formData: KycFormData;
	customerType: CLIENT_CUSTOMER_TYPE;
	onBack: () => void;
	onSubmit: () => void;
	isPending: boolean;
};

const ReviewField = ({ label, value }: { label: string; value: string }) => (
	<div>
		<p className="text-xs text-muted-foreground">{label}</p>
		<p className="mt-0.5 text-sm font-medium">{value}</p>
	</div>
);

const ReviewSection = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div className="space-y-3">
		<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
			{title}
		</h3>
		{children}
	</div>
);

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

			<div className="space-y-6">
				<ReviewSection title="Identity">
					<ReviewField label="Full name" value={formData.fullName ?? ""} />
					<ReviewField
						label="Deriv nickname"
						value={formData.derivNickname ?? ""}
					/>
				</ReviewSection>

				<ReviewSection title="Contact">
					<ReviewField
						label="WhatsApp number"
						value={formData.whatsappNumber ?? ""}
					/>
				</ReviewSection>

				{isNew && (
					<ReviewSection title="Documents">
						<ReviewField
							label="Document type"
							value={
								formData.documentType
									? DOCUMENT_TYPE_CONFIG[formData.documentType].label
									: ""
							}
						/>

						{formData.idFrontPreview && (
							<div>
								<p className="text-xs text-muted-foreground">
									Front of document
								</p>
								<div className="relative mt-1 h-28 overflow-hidden rounded-md">
									<Image
										src={formData.idFrontPreview}
										alt="Front of document"
										fill
										unoptimized
										className="object-cover"
									/>
								</div>
							</div>
						)}

						{formData.idBackPreview && (
							<div>
								<p className="text-xs text-muted-foreground">
									Back of document
								</p>
								<div className="relative mt-1 h-28 overflow-hidden rounded-md">
									<Image
										src={formData.idBackPreview}
										alt="Back of document"
										fill
										unoptimized
										className="object-cover"
									/>
								</div>
							</div>
						)}

						{formData.selfieVideoPreview && (
							<div>
								<p className="text-xs text-muted-foreground">Selfie video</p>
								<KycVideo
									src={formData.selfieVideoPreview}
									className="mt-1 rounded-md"
								/>
							</div>
						)}
					</ReviewSection>
				)}
			</div>

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
