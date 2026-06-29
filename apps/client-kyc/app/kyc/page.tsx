import { buildUrlSearchParams } from "@repo/lib/url";
import ROUTES from "@/lib/constants/routes";
import { verifySession } from "@/lib/session";

const KycPage = async ({ searchParams }: PageProps<typeof ROUTES.KYC>) => {
	const resolvedParams = await searchParams;
	const urlParams = buildUrlSearchParams(resolvedParams);

	await verifySession(`${ROUTES.KYC}?${urlParams}`);

	return <div>Kyc page</div>;
};

export default KycPage;
