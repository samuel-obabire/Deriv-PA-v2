import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./user";

export const invitation = pgTable("invitation", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	inviterId: text("inviter_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	role: text("role"),
	status: text("status").notNull(),
	createdAt: timestamp("created_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
	expiresAt: timestamp("expires_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});
