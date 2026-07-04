import { encodeCallbackUrl } from "@repo/lib/url";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import ROUTES from "./lib/constants/routes";

const publicRoutes: string[] = [ROUTES.HOME, ROUTES.UPLOADTHING];

export async function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	const sessionCookie = getSessionCookie(request);

	if (!sessionCookie && !publicRoutes.includes(pathname)) {
		return NextResponse.redirect(
			new URL(
				`${ROUTES.HOME}${encodeCallbackUrl(pathname + search)}`,
				request.url,
			),
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
	],
};
