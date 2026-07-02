"use client";

import { ClientKycRecord } from "@repo/db";
import { CLIENT_CUSTOMER_TYPE } from "@repo/db/enums";
import { tryCatch } from "@repo/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { submitKycAction } from "@/lib/actions/kyc/submitKyc";
import { updateKycAction } from "@/lib/actions/kyc/updateKyc";
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
	submissionType?: "create" | "update";
	kycData?: Omit<
		ClientKycRecord,
		"idBackKey" | "idFrontKey" | "selfieVideoKey" | "documentType"
	>;
};

const KycPageClient = ({
	token,
	customerType,
	kycData,
	submissionType = "create",
}: Props) => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<KycFormData>({
		fullName: kycData?.fullName,
		derivNickname: kycData?.derivNickname,
		whatsappNumber: kycData?.whatsappNumber,
		documentType: undefined,
		idFrontKey: undefined,
		idFrontPreview: undefined,
		idBackKey: undefined,
		idBackPreview: undefined,
		selfieVideoKey: undefined,
		selfieVideoPreview: undefined,
	});
	const [isPending, setIsPending] = useState(false);

	const handleNext = (stepData: KycFormData) => {
		setFormData((prev) => ({ ...prev, ...stepData }));
		setCurrentStep((prev) => prev + 1);
	};

	const handleBack = () => setCurrentStep((prev) => prev - 1);

	const handleSubmit = async () => {
		setIsPending(true);

		const [result, error] = await tryCatch(() => {
			const fn =
				submissionType === "create" ? submitKycAction : updateKycAction;

			const res = fn(token, formData);
			return res;
		});

		setIsPending(false);

		if (error) return toast.error(error.message);
		if (!result.success)
			return toast.error(
				result.error?.message ?? "Submission failed. Please try again.",
			);

		router.push(ROUTES.KYC_SUCCESS);
	};

	const isNew = customerType === CLIENT_CUSTOMER_TYPE.NEW;

	const baseSteps = [
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
	];

	const reviewStep = {
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
	};

	const steps = isNew
		? [
				...baseSteps,
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
				reviewStep,
			]
		: [...baseSteps, reviewStep];

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
