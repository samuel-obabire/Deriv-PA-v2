import { PropsWithChildren } from "react";
import { requireActiveOrg } from "@/lib/session";

export default async function OrgLayout({ children }: PropsWithChildren) {
	await requireActiveOrg();

	return <>{children}</>;
}
