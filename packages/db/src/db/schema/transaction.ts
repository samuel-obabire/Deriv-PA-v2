import { sql } from "drizzle-orm";
import {
	bigint,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { CURRENCY, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../enums";
import { organization } from "./organization";
import { user } from "./user";

export const transactionTypeEnum = pgEnum(
	"transaction_type_enum",
	TRANSACTION_TYPE,
);
const currencyEnum = pgEnum("currency_enum", CURRENCY);
export const transactionStatusEnum = pgEnum(
	"transaction_status_enum",
	TRANSACTION_STATUS,
);

export const transaction = pgTable(
	"transactions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		idempotencyKey: text("idempotency_key").unique(),
		clientId: text("client_id").notNull(),
		clientName: text("client_name"),
		refId: bigint("ref_id", { mode: "number" }),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id),
		staffId: text("staff_id").references(() => user.id),
		amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
		type: transactionTypeEnum("type").notNull(),
		currency: currencyEnum("currency").notNull(),
		status: transactionStatusEnum("status")
			.default(TRANSACTION_STATUS.PENDING)
			.notNull(),
		depositRate: integer("deposit_rate"),
		// Free-text note the staff member entered in the transfer form. Kept
		// separate from what we send Deriv as the payment-agent "notes" field.
		notes: text("notes"),
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
		index("transaction_org_idx").on(table.organizationId),
		index("transaction_client_idx").on(table.clientId),
		index("transaction_client_lower_idx").on(sql`lower(${table.clientId})`),
		index("transaction_org_created_idx").on(
			table.organizationId,
			table.createdAt,
		),
		index("transaction_staff_idx").on(table.staffId),
	],
);

export type Transaction = typeof transaction.$inferSelect;
export type InsertTransaction = typeof transaction.$inferInsert;
