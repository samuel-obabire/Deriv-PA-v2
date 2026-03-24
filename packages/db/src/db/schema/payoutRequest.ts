import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { withdrawalRequest } from "./withdrawalRequest";

export const PayoutStatusEnum = pgEnum("payout_status", [
	"UNMATCHED",
	"MATCHED",
	"FLAGGED",
]);

export const payoutRequest = pgTable("withdrawal_request", {
	id: uuid("id").primaryKey().defaultRandom(),
	withdrawalId: uuid("withdrawal_id").references(() => withdrawalRequest.id),
	amountNgn: numeric("amount_ngn", { precision: 12, scale: 2 }).notNull(),
	recipientName: text("reciepient_name").notNull(),
	recipientAccount: text("reciepient_account").notNull(),
	recipientBank: text("reciepient_bank").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.defaultNow()
		.notNull(),
	status: PayoutStatusEnum("status").default("UNMATCHED").notNull(),
	flagReason: text("flag_reason"),
});
