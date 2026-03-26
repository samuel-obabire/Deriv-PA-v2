import { relations } from "drizzle-orm";
import { payoutRequest } from "./payoutRequest";
import { withdrawalRequest } from "./withdrawalRequest";
import { account } from "./account";
import { session } from "./session";
import { user } from "./user";

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

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));
export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));
export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));
