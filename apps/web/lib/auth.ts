import * as schema from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
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

	experimental: { joins: true },
});
