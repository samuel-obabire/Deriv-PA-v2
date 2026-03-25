import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
});
