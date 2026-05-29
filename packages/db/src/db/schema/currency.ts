import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { CURRENCY } from "../../enums";
import { organization } from "./organization";

export const currencyEnum = pgEnum("currency_enum", CURRENCY);

export const currency = pgTable(
	"currency",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		code: currencyEnum("code").notNull(),
		label: text("label").notNull(),
		token: text("token").notNull(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", {
			precision: 6,
			withTimezone: true,
		})
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
			.$onUpdate(() => new Date())
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("currency_org_idx").on(table.organizationId),
		uniqueIndex("org_currency_unique").on(table.organizationId, table.code), // org + code together must be unique per org
	],
);

export type Currency = typeof currency.$inferSelect;
export type InsertCurrency = typeof currency.$inferInsert;
