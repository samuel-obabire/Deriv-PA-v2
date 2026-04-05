import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { PAYOUT_STATUS } from "../../enums";
import { withdrawalRequest } from "./withdrawalRequest";

export const PayoutStatusEnum = pgEnum("payout_status", PAYOUT_STATUS);

export const payoutRequest = pgTable("payout_request", {
	id: uuid("id").primaryKey().defaultRandom(),
	withdrawalId: uuid("withdrawal_id").references(() => withdrawalRequest.id),
	amountNgn: numeric("amount_ngn", { precision: 12, scale: 2 }).notNull(),
	recipientName: text("reciepient_name").notNull(),
	recipientAccount: text("reciepient_account"),
	recipientBank: text("reciepient_bank"),
	clientCR: text("client_cr"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	status: PayoutStatusEnum("status").default(PAYOUT_STATUS.UNMATCHED).notNull(),
	flagReason: text("flag_reason"),
});

export type PayoutStatus = PAYOUT_STATUS;
export type PayoutRequest = typeof payoutRequest.$inferSelect;
