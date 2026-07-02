import { getValidClientKycInvitationByTokenHash } from "@repo/db/queries";
import { DataRenderer } from "@repo/ui";
import { Suspense } from "react";
import KycPageClient from "@/components/kyc/KycPageClient";
import ROUTES from "@/lib/constants/routes";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";

const KycContent = async ({
	searchParams,
}: {
	searchParams: PageProps<typeof ROUTES.KYC>["searchParams"];
}) => {
	const resolvedParams = await searchParams;
	const token =
		typeof resolvedParams.token === "string" ? resolvedParams.token : null;

	await verifySession(token ? `${ROUTES.KYC}?token=${token}` : ROUTES.KYC);

	if (!token) {
		return <InvalidLink message="No invitation token found in this link." />;
	}

	const invitation = await getValidClientKycInvitationByTokenHash(token, db);

	return (
		<DataRenderer
			data={invitation}
			empty={{
				component: (
					<InvalidLink message="This link has expired or is no longer valid. Please request a new one." />
				),
			}}
			render={(invitation) => (
				<KycPageClient token={token} customerType={invitation.customerType} />
			)}
		/>
	);
};

const InvalidLink = ({ message }: { message: string }) => {
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-sm text-center space-y-3">
				<h1 className="text-xl font-semibold">Link invalid</h1>
				<p className="text-sm text-muted-foreground">{message}</p>
			</div>
		</div>
	);
};

const KycPage = ({ searchParams }: PageProps<typeof ROUTES.KYC>) => {
	return (
		<Suspense fallback={null}>
			<KycContent searchParams={searchParams} />
		</Suspense>
	);
};

export default KycPage;
