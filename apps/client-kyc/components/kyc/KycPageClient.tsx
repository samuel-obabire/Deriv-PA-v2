"use client";

import { CLIENT_CUSTOMER_TYPE } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { submitKycAction } from "@/lib/actions/kyc/submitKyc";
import ROUTES from "@/lib/constants/routes";
import type { KycFormData } from "@/lib/validations/kyc";
import KycWizard from "./KycWizard";
import ContactForm from "./steps/ContactForm";
import DocumentUpload from "./steps/DocumentUpload";
import IdentityForm from "./steps/IdentityForm";
import ReviewStep from "./steps/ReviewStep";
import VideoSelfie from "./steps/VideoSelfie";

type Props = {
	token: string;
	customerType: CLIENT_CUSTOMER_TYPE;
};

const KycPageClient = ({ token, customerType }: Props) => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<KycFormData>({});
	const [isPending, setIsPending] = useState(false);

	const handleNext = (stepData: KycFormData) => {
		setFormData((prev) => ({ ...prev, ...stepData }));
		setCurrentStep((prev) => prev + 1);
	};

	const handleBack = () => setCurrentStep((prev) => prev - 1);

	const handleSubmit = async () => {
		setIsPending(true);

		const [result, error] = await tryCatch(() =>
			submitKycAction(token, formData),
		);

		setIsPending(false);

		if (error) return toast.error(error.message);
		if (!result.success)
			return toast.error(
				result.error?.message ?? "Submission failed. Please try again.",
			);

		router.push(ROUTES.KYC_SUCCESS);
	};

	const isNew = customerType === CLIENT_CUSTOMER_TYPE.NEW;

	const steps = isNew
		? [
				{
					title: "Identity Verification",
					component: (
						<IdentityForm
							defaultValues={{
								fullName: formData.fullName ?? "",
								derivNickname: formData.derivNickname ?? "",
							}}
							onNext={handleNext}
						/>
					),
				},
				{
					title: "Contact Details",
					component: (
						<ContactForm
							defaultValues={{
								whatsappNumber: formData.whatsappNumber ?? "",
							}}
							onBack={handleBack}
							onNext={handleNext}
						/>
					),
				},
				{
					title: "Document Verification",
					component: (
						<DocumentUpload
							defaultValues={{
								documentType: formData.documentType,
								idFrontKey: formData.idFrontKey ?? "",
								idFrontPreview: formData.idFrontPreview ?? "",
								idBackKey: formData.idBackKey ?? "",
								idBackPreview: formData.idBackPreview ?? "",
							}}
							onBack={handleBack}
							onNext={(data, previews) => handleNext({ ...data, ...previews })}
						/>
					),
				},
				{
					title: "Live Selfie Validation",
					component: (
						<VideoSelfie
							defaultValues={{
								selfieVideoKey: formData.selfieVideoKey ?? "",
								selfieVideoPreview: formData.selfieVideoPreview ?? "",
							}}
							onBack={handleBack}
							onNext={(data, previewUrl) =>
								handleNext({ ...data, selfieVideoPreview: previewUrl })
							}
						/>
					),
				},
				{
					title: "Review & Submit",
					component: (
						<ReviewStep
							formData={formData}
							customerType={customerType}
							onBack={handleBack}
							onSubmit={handleSubmit}
							isPending={isPending}
						/>
					),
				},
			]
		: [
				{
					title: "Identity Verification",
					component: (
						<IdentityForm
							defaultValues={{
								fullName: formData.fullName ?? "",
								derivNickname: formData.derivNickname ?? "",
							}}
							onNext={handleNext}
						/>
					),
				},
				{
					title: "Contact Details",
					component: (
						<ContactForm
							defaultValues={{
								whatsappNumber: formData.whatsappNumber ?? "",
							}}
							onBack={handleBack}
							onNext={handleNext}
						/>
					),
				},
				{
					title: "Review & Submit",
					component: (
						<ReviewStep
							formData={formData}
							customerType={customerType}
							onBack={handleBack}
							onSubmit={handleSubmit}
							isPending={isPending}
						/>
					),
				},
			];

	return (
		<div
			aria-busy={isPending}
			className={isPending ? "pointer-events-none opacity-60" : undefined}
		>
			<KycWizard currentStep={currentStep} steps={steps} />
		</div>
	);
};

export default KycPageClient;
