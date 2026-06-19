import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import ROUTES from "./lib/constants/routes";

const publicRoutes = [ROUTES.SIGN_IN];

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const sessionCookie = getSessionCookie(request);

	// optimistic redirect
	if (!sessionCookie && !publicRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
	],
};
