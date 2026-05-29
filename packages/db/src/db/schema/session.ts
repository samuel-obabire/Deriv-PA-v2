import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	activeOrganizationId: text("active_organization_id"),
	activeTeamId: text("active_team_id"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
