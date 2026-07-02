"use client";

import { Button } from "@repo/ui";
import { generateReactHelpers } from "@uploadthing/react";
import { RefreshCw, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import KycVideo from "@/components/kyc/KycVideo";
import type { UploadRouter } from "@/lib/uploadthing";

const { useUploadThing } = generateReactHelpers<UploadRouter>();

type RecordVideoProps = {
	capturedPreview?: string;
	onRecorded: (customId: string, previewUrl: string) => void;
};

const RecordVideo = ({ capturedPreview, onRecorded }: RecordVideoProps) => {
	const webcamRef = useRef<Webcam>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const pendingPreviewRef = useRef<string>("");
	const blobUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
		};
	}, []);

	const [isOpen, setIsOpen] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		capturedPreview ?? null,
	);

	const { startUpload, isUploading } = useUploadThing("kycSelfie", {
		onClientUploadComplete: (res) => {
			const customId = res[0]?.customId;
			if (customId) {
				onRecorded(customId, pendingPreviewRef.current);
				blobUrlRef.current = null; // parent now owns the URL, don't revoke on unmount
			}
			setIsOpen(false);
		},
	});

	const handleStartRecording = useCallback(() => {
		const stream = webcamRef.current?.stream;
		if (!stream) return;

		chunksRef.current = [];
		const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) chunksRef.current.push(e.data);
		};

		recorder.onstop = () => {
			const blob = new Blob(chunksRef.current, { type: "video/webm" });
			if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
			const url = URL.createObjectURL(blob);
			blobUrlRef.current = url;
			setPreviewUrl(url);
			pendingPreviewRef.current = url;
			setIsRecording(false);
		};

		mediaRecorderRef.current = recorder;
		recorder.start();
		setIsRecording(true);
	}, []);

	const handleStopRecording = useCallback(() => {
		mediaRecorderRef.current?.stop();
	}, []);

	const handleUpload = useCallback(async () => {
		const blob = new Blob(chunksRef.current, { type: "video/webm" });
		const file = new File([blob], `kyc-selfie-${Date.now()}.webm`, {
			type: "video/webm",
		});
		await startUpload([file]);
	}, [startUpload]);

	const handleReRecord = useCallback(() => {
		if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
		blobUrlRef.current = null;
		setPreviewUrl(null);
		chunksRef.current = [];
	}, []);

	if (previewUrl && !isOpen) {
		return (
			<div className="flex flex-col gap-2">
				<KycVideo
					src={previewUrl}
					className="overflow-hidden rounded-lg border"
				/>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => {
						if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
						blobUrlRef.current = null;
						setPreviewUrl(null);
						setIsOpen(true);
					}}
					className="w-full gap-2"
				>
					<RefreshCw className="size-4" />
					Re-record
				</Button>
			</div>
		);
	}

	if (isOpen) {
		if (previewUrl) {
			return (
				<div className="flex flex-col gap-3">
					<KycVideo
						src={previewUrl}
						className="overflow-hidden rounded-lg border"
					/>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleReRecord}
							className="flex-1"
							disabled={isUploading}
						>
							Re-record
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={handleUpload}
							disabled={isUploading}
							className="flex-1"
						>
							{isUploading ? "Uploading…" : "Use this video"}
						</Button>
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-col gap-3">
				<div className="overflow-hidden rounded-lg border">
					<Webcam
						ref={webcamRef}
						audio
						muted
						videoConstraints={{ facingMode: "user" }}
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
						disabled={isRecording}
					>
						Cancel
					</Button>
					{isRecording ? (
						<Button
							type="button"
							size="sm"
							onClick={handleStopRecording}
							className="flex-1 gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
						>
							<span className="size-2 rounded-full bg-white animate-pulse" />
							Stop recording
						</Button>
					) : (
						<Button
							type="button"
							size="sm"
							onClick={handleStartRecording}
							className="flex-1 gap-2"
						>
							<Video className="size-4" />
							Start recording
						</Button>
					)}
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
			<Video className="size-5 text-muted-foreground" />
			<span className="text-sm text-muted-foreground">
				Tap to record selfie video
			</span>
		</Button>
	);
};

export default RecordVideo;
