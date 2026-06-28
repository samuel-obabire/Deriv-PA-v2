import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { clientEnv } from "./validations/env/client";
import { serverEnv } from "./validations/env/server";

export const auth = betterAuth({
	appName: "ClientKYC",
	baseURL: clientEnv.NEXT_PUBLIC_URL,
	secret: serverEnv.BETTER_AUTH_SECRET,

	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: serverEnv.GOOGLE_CLIENT_ID,
			clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
		},
	},

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 7 * 24 * 60 * 60, // 7 days
			strategy: "jwe",
			refreshCache: true,
		},
	},

	account: {
		storeStateStrategy: "cookie",
		storeAccountCookie: true,
	},

	plugins: [nextCookies()],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
