import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { CLIENT_CUSTOMER_TYPE } from "../../enums";
import { organization } from "./organization";

export const clientCustomerTypeEnum = pgEnum(
	"client_customer_type_enum",
	CLIENT_CUSTOMER_TYPE,
);

export const clientKycInvitation = pgTable(
	"client_kyc_invitation",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		customerType: clientCustomerTypeEnum("customer_type").notNull(),
		tokenHash: text("token_hash").notNull().unique(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at", {
			precision: 6,
			withTimezone: true,
		}).notNull(),
		createdAt: timestamp("created_at", {
			precision: 6,
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
	},
	(table) => [index("kyc_invitation_org_idx").on(table.organizationId)],
);

export type ClientKycInvitation = typeof clientKycInvitation.$inferSelect;
export type InsertClientKycInvitation = typeof clientKycInvitation.$inferInsert;
