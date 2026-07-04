import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { session } from "./session";
import { user } from "./user";

export const elevatedAccessGrant = pgTable(
	"elevated_access_grant",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		sessionId: text("session_id")
			.notNull()
			.references(() => session.id, { onDelete: "cascade" }),
		targetUserId: text("target_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		isGranted: boolean("is_granted").notNull().default(false),
		grantedAt: timestamp("granted_at", { precision: 6, withTimezone: true }),
		expiresAt: timestamp("expires_at", { precision: 6, withTimezone: true }),
		createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("elevated_access_grant_org_idx").on(table.organizationId),
		index("elevated_access_grant_user_idx").on(table.targetUserId),
		index("elevated_access_grant_org_granted_idx").on(
			table.organizationId,
			table.isGranted,
		),
		unique("elevated_access_grant_session_org_unique").on(
			table.sessionId,
			table.organizationId,
		),
	],
);

export type ElevatedAccessGrant = typeof elevatedAccessGrant.$inferSelect;
export type InsertElevatedAccessGrant = typeof elevatedAccessGrant.$inferInsert;
