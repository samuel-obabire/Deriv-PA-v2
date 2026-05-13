import { PropsWithChildren, Suspense } from "react";
import NavbarSlim from "@/components/nav/NavbarSlim";
import { getSession } from "@/lib/session";

export default async function PagesLayout({ children }: PropsWithChildren) {
	const sessionPromise = getSession();

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
