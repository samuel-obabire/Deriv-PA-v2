import * as schema from "@repo/db";
import { getUser } from "@repo/db/queries";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
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

const options = {
	appName: "Adeluxe",

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
			maxAge: 15 * 60,
		},
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
