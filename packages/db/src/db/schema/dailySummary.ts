import {
	date,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const dailySummary = pgTable(
	"daily_summary",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id),
		businessDate: date("business_date", { mode: "date" }).notNull(),
		totalAmount: numeric("total_amount", { precision: 18, scale: 2 })
			.notNull()
			.default("0"),
		totalSuccessfulAmount: numeric("total_successful_amount", {
			precision: 18,
			scale: 2,
		})
			.notNull()
			.default("0"),
		totalNgnAmount: numeric("total_ngn_amount", { precision: 18, scale: 2 })
			.notNull()
			.default("0"),
		totalCount: integer("total_count").notNull().default(0),
		totalSuccessful: integer("total_successful").notNull().default(0),
		totalCancelled: integer("total_cancelled").notNull().default(0),
		totalFailed: integer("total_failed").notNull().default(0),
		createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
			.$onUpdate(() => new Date())
			.defaultNow()
			.notNull(),
	},
	(table) => [
		unique("daily_summary_org_business_date_unique").on(
			table.organizationId,
			table.businessDate,
		),
		index("daily_summary_org_idx").on(table.organizationId),
		index("daily_summary_business_date_idx").on(table.businessDate),
	],
);

export type DailySummary = typeof dailySummary.$inferSelect;
export type InsertDailySummary = typeof dailySummary.$inferInsert;
