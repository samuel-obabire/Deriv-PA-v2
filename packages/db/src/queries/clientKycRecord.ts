import { and, eq } from "drizzle-orm";
import { clientKycRecord } from "../db/schema";
import type { ClientKycRecordUpdateData } from "../db/schema/clientKycRecord";
import type { DB } from "../types";

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

export const deleteClientKycRecord = async (id: string, db: DB) => {
	const [deleted] = await db
		.delete(clientKycRecord)
		.where(eq(clientKycRecord.id, id))
		.returning();

	return deleted ?? null;
};
