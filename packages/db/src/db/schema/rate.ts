import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const rate = pgTable("rate", {
	id: uuid("id").primaryKey().defaultRandom(),
	deposit: integer("deposit").notNull(),
	charge: integer("charge").notNull(),
	smallAmount: integer("small_amount").notNull(),
	withdrawal: integer("withdrawal").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
});

export type Rate = typeof rate.$inferSelect;
