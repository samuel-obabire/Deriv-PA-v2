import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { KYC_DOCUMENT_TYPE, KYC_STATUS } from "../../enums";
import { organization } from "./organization";

export const kycStatusEnum = pgEnum("kyc_status_enum", KYC_STATUS);
export const kycDocumentTypeEnum = pgEnum(
	"kyc_document_type_enum",
	KYC_DOCUMENT_TYPE,
);

export const clientKycRecord = pgTable(
	"client_kyc_record",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		fullName: text("full_name").notNull(),
		derivNickname: text("deriv_nickname").notNull().unique(),
		phoneNumber: text("phone_number").notNull().unique(),
		whatsappNumber: text("whatsapp_number").notNull().unique(),
		status: kycStatusEnum("status").notNull().default(KYC_STATUS.UNVERIFIED),
		documentType: kycDocumentTypeEnum("document_type"),
		idFrontUrl: text("id_front_url"),
		idBackUrl: text("id_back_url"),
		selfieVideoUrl: text("selfie_video_url"),
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
		index("kyc_record_org_idx").on(table.organizationId),
		index("kyc_record_status_idx").on(table.status),
	],
);

export type ClientKycRecord = typeof clientKycRecord.$inferSelect;
export type ClientKycRecordUpdateData = Partial<
	Omit<typeof clientKycRecord.$inferInsert, "id" | "createdAt" | "updatedAt">
>;
