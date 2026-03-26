import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const WithdrawalStatusEnum = pgEnum("withdrawal_status", [
	"PENDING",
	"MATCHED",
	"FLAGGED",
	"MISSING",
]);

export type WithdrawalStatus = (typeof WithdrawalStatusEnum.enumValues)[number];

export const withdrawalRequest = pgTable("withdrawal_request", {
	id: uuid("id").primaryKey().defaultRandom(),
	derivId: text("deriv_id").notNull().unique(),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	amountNgn: numeric("amount_ngn", { precision: 12, scale: 2 }).notNull(),
	currency: text("currency").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	status: WithdrawalStatusEnum("status").default("PENDING").notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequest.$inferSelect;
export type NewWithdrawalRequest = typeof withdrawalRequest.$inferInsert;
