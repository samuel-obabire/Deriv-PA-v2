import { Spinner } from "@repo/ui";
import { Suspense } from "react";
import DerivCallbackClient from "@/components/features/kyc/DerivCallbackClient";
import ROUTES from "@/lib/constants/routes";
import { verifySession } from "@/lib/session";

const DerivCallbackPage = async () => {
	await verifySession(ROUTES.DERIV_CALLBACK);

	return (
		<Suspense
			fallback={
				<div className="flex min-h-[60vh] items-center justify-center">
					<Spinner className="size-8" />
				</div>
			}
		>
			<DerivCallbackClient />
		</Suspense>
	);
};

export default DerivCallbackPage;
