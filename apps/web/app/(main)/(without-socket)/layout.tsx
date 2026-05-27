import { PropsWithChildren, Suspense } from "react";
import NavbarSlim from "@/components/nav/NavbarSlim";
import { verifySession } from "@/lib/session";

export default async function PagesLayout({ children }: PropsWithChildren) {
	const sessionPromise = verifySession();

	return (
		<>
			<header className="bg-background h-16 top-0 sticky z-50">
				<Suspense fallback={<div />}>
					<NavbarSlim sessionPromise={sessionPromise} />
				</Suspense>
			</header>

			{children}
		</>
	);
}
