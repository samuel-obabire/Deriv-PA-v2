import { eq } from "drizzle-orm";
import { clientKycInvitation } from "../db/schema";
import type { InsertClientKycInvitation } from "../db/schema/clientKycInvitation";
import type { DB } from "../types";

export const getClientKycInvitationByTokenHash = async (
	tokenHash: string,
	db: DB,
) => {
	const [invitation] = await db
		.select()
		.from(clientKycInvitation)
		.where(eq(clientKycInvitation.tokenHash, tokenHash));

	return invitation ?? null;
};

export const getClientKycInvitationsByOrg = async (
	organizationId: string,
	db: DB,
) => {
	return db
		.select()
		.from(clientKycInvitation)
		.where(eq(clientKycInvitation.organizationId, organizationId));
};

export const createClientKycInvitation = async (
	data: InsertClientKycInvitation,
	db: DB,
) => {
	const [created] = await db
		.insert(clientKycInvitation)
		.values(data)
		.returning();

	if (!created) throw new Error("Failed to create KYC invitation");

	return created;
};

export const deleteClientKycInvitation = async (id: string, db: DB) => {
	const [deleted] = await db
		.delete(clientKycInvitation)
		.where(eq(clientKycInvitation.id, id))
		.returning();

	return deleted ?? null;
};
