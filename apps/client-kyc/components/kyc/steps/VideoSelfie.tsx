"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel } from "@repo/ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";
import RecordVideo from "@/components/kyc/capture/RecordVideo";
import { VideoSelfieSchema } from "@/lib/validations/kyc";

type Props = {
	defaultValues?: Partial<z.infer<typeof VideoSelfieSchema>> & {
		selfieVideoPreview?: string;
	};
	onBack: () => void;
	onNext: (data: z.infer<typeof VideoSelfieSchema>, previewUrl: string) => void;
};

const VideoSelfie = ({ defaultValues, onBack, onNext }: Props) => {
	const [previewUrl, setPreviewUrl] = useState(
		defaultValues?.selfieVideoPreview ?? "",
	);

	const form = useForm<z.infer<typeof VideoSelfieSchema>>({
		resolver: zodResolver(VideoSelfieSchema),
		defaultValues: { selfieVideoKey: "", ...defaultValues },
	});

	return (
		<form
			id="selfie-form"
			onSubmit={form.handleSubmit((data) => onNext(data, previewUrl))}
		>
			<FieldGroup>
				<div className="space-y-3 text-sm text-muted-foreground">
					<p>
						Record a short video of yourself holding your document clearly
						visible. Ensure your face is fully lit, and read the script below
						out loud to confirm your identity.
					</p>
					<div className="rounded-md border border-border bg-muted/50 p-3">
						<p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
							Please say clearly into the camera:
						</p>
						<p className="italic text-foreground">
							&ldquo;My name is [Full Name]. I am submitting my KYC on this
							platform to authorize all my transactions, and I confirm that this
							information belongs entirely to me.&rdquo;
						</p>
					</div>
				</div>

				<Controller
					name="selfieVideoKey"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Selfie video</FieldLabel>
							<RecordVideo
								capturedPreview={previewUrl || undefined}
								onRecorded={(customId, blobUrl) => {
									form.setValue("selfieVideoKey", customId, {
										shouldValidate: true,
									});
									setPreviewUrl(blobUrl);
								}}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
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
					form="selfie-form"
					disabled={form.formState.isSubmitting}
					className="flex-1"
				>
					Continue
				</Button>
			</div>
		</form>
	);
};

export default VideoSelfie;
