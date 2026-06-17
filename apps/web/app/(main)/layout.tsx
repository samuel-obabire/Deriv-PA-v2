import { PropsWithChildren, Suspense } from "react";
import { DesktopSideBar } from "@/components/nav/sidebar";
import { verifySession } from "@/lib/session";

export default async function AuditLayout({ children }: PropsWithChildren) {
	const sessionPromise = verifySession();

	return (
		<div className="lg:grid lg:grid-cols-[300px_1fr] h-dvh overflow-hidden">
			<Suspense fallback={<div />}>
				<DesktopSideBar sessionPromise={sessionPromise} />
			</Suspense>

			<main className="overflow-y-auto">{children}</main>
		</div>
	);
}
