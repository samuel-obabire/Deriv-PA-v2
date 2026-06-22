import * as schema from "@repo/db";
import { getUser } from "@repo/db/queries";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { customSession, Member, organization } from "better-auth/plugins";
import { db } from "./db";
import {
	ac,
	admin,
	auditor,
	cashier,
	member,
	owner,
	RoleNames,
} from "./permissions";
import { clientEnv } from "./validations/env/client";
import { serverEnv } from "./validations/env/server";

const APP_NAME = "DerivPA";

const options = {
	appName: APP_NAME,
	baseURL: clientEnv.NEXT_PUBLIC_URL,

	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: serverEnv.GOOGLE_CLIENT_ID,
			clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
		},
	},

	database: drizzleAdapter(db, {
		provider: "pg",
		schema: { ...schema },
		transaction: true,
	}),

	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},

		expiresIn: 60 * 60 * 24, // 24 hours
		updateAge: 60 * 60, // Check every 60 minutes
	},

	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.context.newSession) {
				// destroy other sessions on sign-in
				const { session, user } = ctx.context.newSession;

				const allSessions = await ctx.context.internalAdapter.listSessions(
					user.id,
				);

				for (const s of allSessions) {
					if (s.token !== session.token) {
						await ctx.context.internalAdapter.deleteSession(s.token);
					}
				}
			}
		}),
	},

	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const user = await getUser(session.userId, db);
					return {
						data: {
							...session,
							activeOrganizationId: user?.activeOrgId,
						},
					};
				},
			},
		},
	},

	experimental: { joins: true },
	plugins: [
		organization({
			ac,
			roles: { owner, admin, member, auditor, cashier },
		}),
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...options,
	plugins: [
		...(options.plugins ?? []),
		customSession(async ({ user, session }, ctx) => {
			let activeOrgRole: string | null = "";

			const member = (await ctx.context.adapter.findOne({
				model: "member",
				where: [
					{ field: "userId", value: user.id },
					{
						field: "organizationId",
						value: session.activeOrganizationId as string | null,
					},
				],
			})) as Member | null;

			activeOrgRole = member?.role ?? null;

			return {
				user: { ...user, role: activeOrgRole as RoleNames },
				session,
			};
		}, options),
		nextCookies(),
	],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
export type SessionWithActiveOrg = Session & {
	session: Session["session"] & { activeOrganizationId: string };
};
