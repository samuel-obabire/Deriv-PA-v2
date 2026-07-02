"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KYC_DOCUMENT_TYPE } from "@repo/db/enums";
import {
	Button,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import CapturePhoto from "@/components/kyc/capture/CapturePhoto";
import { DOCUMENT_TYPE_CONFIG } from "@/lib/constants/kyc";
import { DocumentSchema } from "@/lib/validations/kyc";

type DocumentPreviews = {
	idFrontPreview?: string;
	idBackPreview?: string;
};

type Props = {
	defaultValues?: Partial<z.infer<typeof DocumentSchema>> & DocumentPreviews;
	onBack: () => void;
	onNext: (
		data: z.infer<typeof DocumentSchema>,
		previews: DocumentPreviews,
	) => void;
};

const DocumentUpload = ({ defaultValues, onBack, onNext }: Props) => {
	const [idFrontPreview, setIdFrontPreview] = useState(
		defaultValues?.idFrontPreview ?? "",
	);
	const [idBackPreview, setIdBackPreview] = useState(
		defaultValues?.idBackPreview ?? "",
	);

	const form = useForm<z.infer<typeof DocumentSchema>>({
		resolver: zodResolver(DocumentSchema),
		defaultValues: {
			documentType: undefined,
			idFrontKey: "",
			idBackKey: "",
			...defaultValues,
		},
	});

	const documentType = form.watch("documentType");
	const config = documentType ? DOCUMENT_TYPE_CONFIG[documentType] : null;

	const handleSubmit = form.handleSubmit((data) => {
		onNext(data, { idFrontPreview, idBackPreview });
	});

	return (
		<form id="document-form" onSubmit={handleSubmit}>
			<FieldGroup>
				<Controller
					name="documentType"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="documentType">Document type</FieldLabel>
							<Select
								onValueChange={(val) => {
									field.onChange(val);
									// Clear back photo when switching to a type without back view
									const newConfig =
										DOCUMENT_TYPE_CONFIG[val as KYC_DOCUMENT_TYPE];
									if (!newConfig?.hasBackView) {
										form.setValue("idBackKey", "");
										setIdBackPreview("");
									}
								}}
								defaultValue={field.value}
							>
								<SelectTrigger
									id="documentType"
									aria-invalid={fieldState.invalid}
									className="w-full no-ring"
								>
									<SelectValue placeholder="Select document type" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(KYC_DOCUMENT_TYPE).map((type) => (
										<SelectItem key={type} value={type}>
											{DOCUMENT_TYPE_CONFIG[type].label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="idFrontKey"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Front of document</FieldLabel>
							<CapturePhoto
								label="Front of document"
								capturedId={field.value || undefined}
								capturedPreview={idFrontPreview || undefined}
								onCaptured={(customId, preview) => {
									form.setValue("idFrontKey", customId, {
										shouldValidate: true,
									});
									setIdFrontPreview(preview);
								}}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{config?.hasBackView && (
					<Controller
						name="idBackKey"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Back of document</FieldLabel>
								<CapturePhoto
									label="Back of document"
									capturedId={field.value || undefined}
									capturedPreview={idBackPreview || undefined}
									onCaptured={(customId, preview) => {
										form.setValue("idBackKey", customId, {
											shouldValidate: true,
										});
										setIdBackPreview(preview);
									}}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				)}
			</FieldGroup>

			<div className="mt-8 flex gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={form.formState.isSubmitting}
					className="flex-1"
				>
					Back
				</Button>
				<Button
					type="submit"
					form="document-form"
					disabled={form.formState.isSubmitting}
					className="flex-1"
				>
					Continue
				</Button>
			</div>
		</form>
	);
};

export default DocumentUpload;
