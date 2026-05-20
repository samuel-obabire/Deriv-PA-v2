import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const rate = pgTable(
	"rate",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" })
			.unique(),
		deposit: integer("deposit").notNull(),
		charge: integer("charge").notNull(),
		smallAmount: integer("small_amount").notNull(),
		withdrawal: integer("withdrawal").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("rate_org_idx").on(table.organizationId)],
);

export type Rate = typeof rate.$inferSelect;
export type InsertRate = typeof rate.$inferInsert;
