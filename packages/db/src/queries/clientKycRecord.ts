import { and, eq } from "drizzle-orm";
import { clientKycInvitation, clientKycRecord } from "../db/schema";
import type {
	ClientKycRecordUpdateData,
	InsertClientKycRecord,
} from "../db/schema/clientKycRecord";
import { KYC_STATUS } from "../enums";
import type { DB } from "../types";
import {
	getUniqueConstraintName,
	isUniqueConstraintError,
} from "../utils/pgErrors";

export const getClientKycRecordById = async (id: string, db: DB) => {
	const [record] = await db
		.select()
		.from(clientKycRecord)
		.where(eq(clientKycRecord.id, id));

	return record ?? null;
};

export const getClientKycRecordByEmail = async (
	{ organizationId, email }: { organizationId: string; email: string },
	db: DB,
) => {
	const [record] = await db
		.select()
		.from(clientKycRecord)
		.where(
			and(
				eq(clientKycRecord.organizationId, organizationId),
				eq(clientKycRecord.email, email),
			),
		);

	return record ?? null;
};

export const getClientKycRecordsByOrg = async (
	organizationId: string,
	db: DB,
) => {
	return db
		.select()
		.from(clientKycRecord)
		.where(eq(clientKycRecord.organizationId, organizationId));
};

export const getClientKycRecordsPendingReview = async (
	organizationId: string,
	db: DB,
) => {
	return db
		.select()
		.from(clientKycRecord)
		.where(
			and(
				eq(clientKycRecord.organizationId, organizationId),
				eq(clientKycRecord.status, KYC_STATUS.PENDING_REVIEW),
			),
		);
};

export const updateClientKycRecord = async (
	{ id, data }: { id: string; data: ClientKycRecordUpdateData },
	db: DB,
) => {
	const [updated] = await db
		.update(clientKycRecord)
		.set(data)
		.where(eq(clientKycRecord.id, id))
		.returning();

	if (!updated) throw new Error("KYC record not found");

	return updated;
};

export const createClientKycRecord = async (
	data: InsertClientKycRecord,
	db: DB,
) => {
	const [created] = await db.insert(clientKycRecord).values(data).returning();

	if (!created) throw new Error("Failed to create KYC record");

	return created;
};

export const createKycRecordAndBurnInvitation = async (
	data: InsertClientKycRecord,
	invitationId: string,
	db: DB,
) => {
	try {
		return await db.transaction(async (tx) => {
			const [created] = await tx
				.insert(clientKycRecord)
				.values(data)
				.returning();

			if (!created) throw new Error("Failed to create KYC record");

			await tx
				.delete(clientKycInvitation)
				.where(eq(clientKycInvitation.id, invitationId));

			return created;
		});
	} catch (err) {
		if (isUniqueConstraintError(err)) {
			const constraint = getUniqueConstraintName(err);
			throw new Error(
				(constraint && KYC_UNIQUE_CONSTRAINT_MESSAGES[constraint]) ??
					"A record with these details already exists",
			);
		}
		throw err;
	}
};

export const updateKycRecordAndBurnInvitation = async (
	{ id, data }: { id: string; data: ClientKycRecordUpdateData },
	invitationId: string,
	db: DB,
) => {
	try {
		return await db.transaction(async (tx) => {
			const [updated] = await tx
				.update(clientKycRecord)
				.set(data)
				.where(eq(clientKycRecord.id, id))
				.returning();

			if (!updated) throw new Error("KYC record not found");

			await tx
				.delete(clientKycInvitation)
				.where(eq(clientKycInvitation.id, invitationId));

			return updated;
		});
	} catch (err) {
		if (isUniqueConstraintError(err)) {
			const constraint = getUniqueConstraintName(err);
			throw new Error(
				(constraint && KYC_UNIQUE_CONSTRAINT_MESSAGES[constraint]) ??
					"A record with these details already exists",
			);
		}
		throw err;
	}
};

export const deleteClientKycRecord = async (id: string, db: DB) => {
	const [deleted] = await db
		.delete(clientKycRecord)
		.where(eq(clientKycRecord.id, id))
		.returning();

	return deleted ?? null;
};

const KYC_UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
	kyc_record_org_email_unique: "A KYC record with this email already exists",
	client_kyc_record_deriv_nickname_unique:
		"This Deriv nickname is already registered",
	kyc_record_org_whatsapp_unique:
		"This WhatsApp number is already registered for this organisation",
};
