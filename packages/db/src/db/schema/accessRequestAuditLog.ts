import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { ACCESS_REQUEST_ACTION } from "../../enums";
import { organization } from "./organization";
import { user } from "./user";

export const accessRequestActionEnum = pgEnum(
	"access_request_action_enum",
	ACCESS_REQUEST_ACTION,
);

export const accessRequestAuditLog = pgTable(
	"access_request_audit_log",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		memberId: text("member_id").references(() => user.id, {
			onDelete: "set null",
		}),
		memberEmail: text("member_email").notNull(),
		actionType: accessRequestActionEnum("action_type").notNull(),
		actorUserId: text("actor_user_id").references(() => user.id, {
			onDelete: "set null",
		}),
		actorEmail: text("actor_email").notNull(),
		createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
			.$onUpdate(() => new Date())
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("access_request_audit_log_org_idx").on(table.organizationId),
		index("access_request_audit_log_member_idx").on(table.memberId),
		index("access_request_audit_log_action_idx").on(table.actionType),
		index("access_request_audit_log_org_created_idx").on(
			table.organizationId,
			table.createdAt,
		),
	],
);

export type AccessRequestAuditLog = typeof accessRequestAuditLog.$inferSelect;
export type InsertAccessRequestAuditLog =
	typeof accessRequestAuditLog.$inferInsert;
