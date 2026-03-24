import {
	numeric,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const withdrawalRequest = pgTable("withdrawal_request", {
	id: uuid("id").primaryKey().defaultRandom(),
	derivId: varchar("deriv_id", { length: 255 }).notNull().unique(),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	amountNgn: numeric("amount_ngn", { precision: 12, scale: 2 }).notNull(),
	currency: varchar("currency", { length: 10 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequest.$inferSelect;
export type NewWithdrawalRequest = typeof withdrawalRequest.$inferInsert;
