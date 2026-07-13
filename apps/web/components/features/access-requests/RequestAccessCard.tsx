"use client";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui";
import { tryCatch } from "@repo/utils";
import { ShieldAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import useAccessRequestPolling from "@/hooks/useAccessRequestPolling";
import { requestAccess } from "@/lib/actions/accessRequest/requestAccess";

type Props = {
	grantId: string | null;
	isPending: boolean;
};

const RequestAccessCard = ({
	grantId: initialGrantId,
	isPending: initialIsPending,
}: Props) => {
	const [isTransitioning, startTransition] = useTransition();
	const [grantId, setGrantId] = useState(initialGrantId);
	const [isPendingRequest, setIsPendingRequest] = useState(initialIsPending);

	useAccessRequestPolling(isPendingRequest ? grantId : null, () =>
		window.location.reload(),
	);

	const handleRequestAccess = () => {
		startTransition(async () => {
			const [result, error] = await tryCatch(() => requestAccess({}));

			if (error) {
				toast.error(error.message);
				return;
			}

			if (!result.success) {
				toast.error(result.error?.message ?? "Failed to request access");
				return;
			}

			if (!result.data) {
				toast.error("Failed to request access");
				return;
			}

			if (result.data.status === "granted") {
				window.location.reload();
				return;
			}

			setGrantId(result.data.grantId);
			setIsPendingRequest(true);
			toast.success("Access request sent. An admin will review it shortly.");
		});
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="flex size-10 items-center justify-center rounded-full bg-muted ring-1 ring-border">
					<ShieldAlert className="size-5 text-muted-foreground" />
				</div>
				<CardTitle className="mt-3">
					{isPendingRequest
						? "Access request pending"
						: "Elevated access required"}
				</CardTitle>
				<CardDescription>
					{isPendingRequest
						? "An admin needs to approve your request before you can continue. This page will update automatically once approved."
						: "This page requires elevated access. Request approval from an organization admin to continue."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					onClick={handleRequestAccess}
					disabled={isTransitioning || isPendingRequest}
					className="w-full"
				>
					{isPendingRequest
						? "Waiting for approval…"
						: isTransitioning
							? "Requesting…"
							: "Request Access"}
				</Button>
			</CardContent>
		</Card>
	);
};

export default RequestAccessCard;
