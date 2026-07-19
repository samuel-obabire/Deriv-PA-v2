"use client";

import { Banner, Spinner } from "@repo/ui";
import { useSearchParams } from "next/navigation";

const DerivCallbackClient = () => {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");

	if (!code) {
		return (
			<div className="mx-auto max-w-sm px-4 py-16">
				<Banner
					variant="destructive"
					title="Connection failed"
					message="Deriv did not return an authorization code. Please go back and try connecting your account again."
				/>
			</div>
		);
	}

	// TODO: exchange `code` for the client's Deriv profile via a server action.
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<Spinner className="size-8" />
		</div>
	);
};

export default DerivCallbackClient;
