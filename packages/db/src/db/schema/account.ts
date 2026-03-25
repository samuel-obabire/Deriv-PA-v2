import { pgTable, text } from "drizzle-orm/pg-core";

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("provider_account_id").notNull(),
});
