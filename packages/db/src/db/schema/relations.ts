import { relations } from "drizzle-orm";
import { payoutRequest } from "./payoutRequest";
import { withdrawalRequest } from "./withdrawalRequest";

export const payoutRelations = relations(payoutRequest, ({ one }) => ({
	withdrawal: one(withdrawalRequest, {
		fields: [payoutRequest.withdrawalId],
		references: [withdrawalRequest.id],
	}),
}));

export const withdrawalRelation = relations(withdrawalRequest, ({ one }) => ({
	payout: one(payoutRequest, {
		fields: [withdrawalRequest.id],
		references: [payoutRequest.withdrawalId],
	}),
}));
