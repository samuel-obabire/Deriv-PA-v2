import { Suspense } from "react";
import DerivCallbackClient from "@/components/features/deriv/DerivCallbackClient";

const DerivCallbackPage = () => (
	<Suspense fallback={null}>
		<DerivCallbackClient />
	</Suspense>
);

export default DerivCallbackPage;
