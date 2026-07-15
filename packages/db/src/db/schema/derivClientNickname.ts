import {
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const derivClientNickname = pgTable(
	"deriv_client_nickname",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		externalReferenceId: text("external_reference_id").notNull(),
		nickname: text("nickname").notNull(),
		createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
			.$onUpdate(() => new Date())
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("deriv_client_nickname_external_reference_id_unique").on(
			table.externalReferenceId,
		),
	],
);

export type DerivClientNickname = typeof derivClientNickname.$inferSelect;
export type InsertDerivClientNickname = typeof derivClientNickname.$inferInsert;
