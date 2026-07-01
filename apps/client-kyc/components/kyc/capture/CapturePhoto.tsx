"use client";

import { Button } from "@repo/ui";
import { generateReactHelpers } from "@uploadthing/react";
import { Camera, CheckCircle2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import type { UploadRouter } from "@/lib/uploadthing";

const { useUploadThing } = generateReactHelpers<UploadRouter>();

type CapturePhotoProps = {
	label: string;
	capturedId?: string;
	capturedPreview?: string;
	onCaptured: (customId: string, preview: string) => void;
};

const CapturePhoto = ({
	label,
	capturedId,
	capturedPreview,
	onCaptured,
}: CapturePhotoProps) => {
	const webcamRef = useRef<Webcam>(null);
	const pendingPreviewRef = useRef<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const [previewBase64, setPreviewBase64] = useState<string>(
		capturedPreview ?? "",
	);

	const { startUpload, isUploading } = useUploadThing("kycDocument", {
		onClientUploadComplete: (res) => {
			const customId = res[0]?.customId;
			if (customId) {
				const preview = pendingPreviewRef.current;
				setPreviewBase64(preview);
				onCaptured(customId, preview);
			}
			setIsOpen(false);
		},
	});

	const handleCapture = useCallback(async () => {
		const screenshot = webcamRef.current?.getScreenshot();
		if (!screenshot) return;

		pendingPreviewRef.current = screenshot;

		const blob = await fetch(screenshot).then((r) => r.blob());
		const slug = label.toLowerCase().replace(/\s+/g, "-");
		const file = new File([blob], `kyc-${slug}-${Date.now()}.jpg`, {
			type: "image/jpeg",
		});

		await startUpload([file]);
	}, [label, startUpload]);

	const hasCaptured = Boolean(capturedId);

	if (hasCaptured && !isOpen) {
		return (
			<div className="flex flex-col gap-2">
				{previewBase64 ? (
					<div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
						<Image
							src={previewBase64}
							alt={label}
							fill
							unoptimized
							className="object-cover"
						/>
					</div>
				) : (
					<div className="flex aspect-video w-full items-center justify-center rounded-lg border bg-muted">
						<CheckCircle2 className="size-8 text-green-400" />
					</div>
				)}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setIsOpen(true)}
					className="w-full gap-2"
				>
					<RefreshCw className="size-4" />
					Retake
				</Button>
			</div>
		);
	}

	if (isOpen) {
		return (
			<div className="flex flex-col gap-3">
				<div className="overflow-hidden rounded-lg border">
					<Webcam
						ref={webcamRef}
						screenshotFormat="image/jpeg"
						videoConstraints={{ facingMode: "environment" }}
						className="w-full"
					/>
				</div>
				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setIsOpen(false)}
						className="flex-1"
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleCapture}
						disabled={isUploading}
						className="flex-1 gap-2"
					>
						<Camera className="size-4" />
						{isUploading ? "Uploading…" : "Capture"}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<Button
			type="button"
			variant="outline"
			onClick={() => setIsOpen(true)}
			className="h-28 w-full flex-col gap-2 border-dashed"
		>
			<Camera className="size-5 text-muted-foreground" />
			<span className="text-sm text-muted-foreground">
				Tap to capture {label}
			</span>
		</Button>
	);
};

export default CapturePhoto;
