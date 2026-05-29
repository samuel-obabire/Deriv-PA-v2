import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./user";

export const member = pgTable("member", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	createdAt: timestamp("created_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});
