import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { WITHDRAWAL_STATUS } from "../../enums";

export const WithdrawalStatusEnum = pgEnum(
	"withdrawal_status",
	WITHDRAWAL_STATUS,
);

export type WithdrawalStatus = WITHDRAWAL_STATUS;

export const withdrawalRequest = pgTable("withdrawal_request", {
	id: uuid("id").primaryKey().defaultRandom(),
	clientName: text("client_name").notNull(),
	derivId: text("deriv_id").notNull(),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	amountNgn: numeric("amount_ngn", { precision: 12, scale: 2 }).notNull(),
	currency: text("currency").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	status: WithdrawalStatusEnum("status")
		.default(WITHDRAWAL_STATUS.PENDING)
		.notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequest.$inferSelect;
export type NewWithdrawalRequest = typeof withdrawalRequest.$inferInsert;
