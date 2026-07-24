import { sql } from "drizzle-orm";
import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import {
	KYC_DOCUMENT_TYPE,
	KYC_REJECTION_REASON,
	KYC_STATUS,
} from "../../enums";
import { organization } from "./organization";

export const kycStatusEnum = pgEnum("kyc_status_enum", KYC_STATUS);
export const kycDocumentTypeEnum = pgEnum(
	"kyc_document_type_enum",
	KYC_DOCUMENT_TYPE,
);
export const kycRejectionReasonEnum = pgEnum(
	"kyc_rejection_reason_enum",
	KYC_REJECTION_REASON,
);

export const clientKycRecord = pgTable(
	"client_kyc_record",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		email: text("email"),
		fullName: text("full_name").notNull(),
		derivNickname: text("deriv_nickname").notNull(),
		externalReferenceId: text("external_reference_id").notNull(),
		whatsappNumber: text("whatsapp_number"),
		status: kycStatusEnum("status").notNull().default(KYC_STATUS.UNVERIFIED),
		documentType: kycDocumentTypeEnum("document_type"),
		idFrontKey: text("id_front_key"),
		idBackKey: text("id_back_key"),
		selfieVideoKey: text("selfie_video_key"),
		rejectionReason: kycRejectionReasonEnum("rejection_reason"),
		createdAt: timestamp("created_at", {
			precision: 6,
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
			.$onUpdate(() => new Date())
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("kyc_record_org_email_unique").on(
			table.organizationId,
			table.email,
		),
		uniqueIndex("kyc_record_org_whatsapp_unique").on(
			table.organizationId,
			table.whatsappNumber,
		),
		uniqueIndex("kyc_record_org_deriv_nickname").on(
			table.organizationId,
			sql`lower(${table.derivNickname})`,
		),
		uniqueIndex("kyc_record_org_external_reference_id").on(
			table.organizationId,
			table.externalReferenceId,
		),
		index("kyc_record_org_idx").on(table.organizationId),
		index("kyc_record_status_idx").on(table.status),
	],
);

export type ClientKycRecord = typeof clientKycRecord.$inferSelect;
export type InsertClientKycRecord = typeof clientKycRecord.$inferInsert;
export type ClientKycRecordUpdateData = Partial<
	Omit<typeof clientKycRecord.$inferInsert, "id" | "createdAt" | "updatedAt">
>;
