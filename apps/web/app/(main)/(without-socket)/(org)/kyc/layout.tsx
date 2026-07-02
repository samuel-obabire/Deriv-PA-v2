import { PropsWithChildren } from "react";
import { requirePermission, verifySession } from "@/lib/session";

const Kyclayout = async ({ children }: PropsWithChildren) => {
	const session = await verifySession();
	requirePermission(session, "organization", "update");

	return <>{children}</>;
};

export default Kyclayout;
