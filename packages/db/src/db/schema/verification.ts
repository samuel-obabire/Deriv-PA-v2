import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: varchar("identifier", { length: 255 }).notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
