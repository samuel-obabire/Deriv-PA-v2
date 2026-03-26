import * as schema from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

export const auth = betterAuth({
	appName: "Adeluxe",

	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
		},
		transaction: true,
	}),

	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 15 * 60,
		},
	},

	experimental: { joins: true },
	plugins: [nextCookies()],
});
